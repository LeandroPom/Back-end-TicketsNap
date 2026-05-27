// controllers/ticket/ticketBufferController.js

const bulkActivateTicket = require('../../controllers/ticket/bulkActivateTicket');

/**
 * ============================================================
 * BUFFER TEMPORAL EN MEMORIA
 * ============================================================
 * Almacena tickets recién generados hasta que el frontend
 * los solicite.
 *
 * ⚠️ IMPORTANTE:
 * Este buffer se reinicia si el servidor se reinicia.
 * En producción lo ideal sería Redis o DB temporal.
 * ============================================================
 */
let ticketStorage = [];


/**
 * ============================================================
 * ticketBuffer (función única multipropósito)
 * ============================================================
 *
 * MODO 1 - AUTOMÁTICO (Webhook)
 * --------------------------------
 * ticketBuffer(external_reference)
 *
 * Activa tickets mediante bulkActivateTicket
 * y los guarda temporalmente en memoria.
 *
 *
 * MODO 2 - ENDPOINT (Frontend)
 * --------------------------------
 * ticketBuffer(req, res)
 *
 * Devuelve los tickets almacenados
 * y limpia el buffer.
 *
 * ============================================================
 */

module.exports = async function ticketBuffer(arg1, arg2) {

  try {

    /**
     * ============================================================
     * MODO 1: Llamado automático desde notificationPayment
     * ============================================================
     */
    if (typeof arg1 === "string" && arg2 === undefined) {

      const externalReference = arg1;

      if (!externalReference) {
        throw new Error("external_reference inválido.");
      }

      console.log("🎟️ Activando tickets para:", externalReference);

      /**
       * Activación de tickets asociados a la compra
       */
      const tickets = await bulkActivateTicket(externalReference);

      /**
       * Guardar tickets en buffer temporal
       */
      if (Array.isArray(tickets)) {
        ticketStorage.push(...tickets);
      } else {
        ticketStorage.push(tickets);
      }

      console.log(`📦 Tickets almacenados en buffer: ${ticketStorage.length}`);

      return tickets;
    }


    /**
     * ============================================================
     * MODO 2: Endpoint solicitado por frontend
     * ============================================================
     */
    if (arg1 && arg2 && arg1.body !== undefined) {

      const req = arg1;
      const res = arg2;

      console.log("📤 Frontend solicitó tickets almacenados.");

      /**
       * Copiar buffer actual
       */
      const tickets = [...ticketStorage];

      /**
       * Limpiar buffer
       */
      ticketStorage = [];

      console.log(`📭 Tickets entregados: ${tickets.length}`);

      return res.status(200).json({
        success: true,
        tickets
      });
    }


    /**
     * ============================================================
     * Uso incorrecto
     * ============================================================
     */
    throw new Error("Uso inválido de ticketBuffer.");

  } catch (error) {

    console.error("❌ Error en ticketBuffer:", error);

    /**
     * Si se llamó como endpoint responder HTTP
     */
    if (arg2 && typeof arg2.status === "function") {
      return arg2.status(500).json({
        error: "Error interno en ticketBuffer."
      });
    }

    /**
     * Si fue llamado internamente lanzar error
     */
    throw error;
  }
};