const { MercadoPagoConfig, Payment } = require("mercadopago");
const ticketBuffer = require("../mercadoPago/ticketBuffer");

/**
 * Cliente oficial Mercado Pago
 */
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

/**
 * Cache temporal para idempotencia
 * Evita procesar dos veces el mismo paymentId
 * ⚠️ En producción debería persistirse en DB o Redis
 */
const processedPayments = new Set();

/**
 * Webhook Mercado Pago (idempotente)
 */
module.exports = async (req, res) => {

  /**
   * ============================================================
   * 1️⃣ Normalización de datos recibidos
   * MercadoPago puede enviar datos por query o body dependiendo
   * del tipo de notificación.
   * ============================================================
   */
  const notification = { ...req.query, ...req.body };

  if (!notification || Object.keys(notification).length === 0) {
    console.warn("⚠️ Webhook vacío recibido.");
    return res.status(400).json({
      error: "No se recibieron datos en la notificación."
    });
  }

  /**
   * ============================================================
   * 2️⃣ Extracción segura de campos relevantes
   * ============================================================
   */
  const type = notification.type || notification.topic;
  const paymentId = notification?.data?.id || notification?.id;

  const normalizedNotification = {
    action: notification.action || "unknown",
    type: type || "unknown",
    paymentId: paymentId || "unknown",
    live_mode: notification.live_mode || false,
    date_created: notification.date_created || null
  };

  console.log("📩 Webhook recibido:", normalizedNotification);

  /**
   * ============================================================
   * 3️⃣ Respuesta temprana al webhook
   * MercadoPago recomienda responder rápido para evitar retries.
   * ============================================================
   */
  res.sendStatus(200);

  /**
   * ============================================================
   * 4️⃣ Validación de tipo de evento
   * Solo procesamos notificaciones de pago.
   * ============================================================
   */
  if (type !== "payment" || !paymentId) {
    console.log("ℹ️ Evento ignorado (no es payment).");
    return;
  }

  /**
   * ============================================================
   * 5️⃣ Control de idempotencia
   * Evita reprocesar el mismo paymentId.
   * ============================================================
   */
  if (processedPayments.has(paymentId)) {
    console.log("🔁 Webhook duplicado ignorado:", paymentId);
    return;
  }

  processedPayments.add(paymentId);

  try {

    /**
     * ============================================================
     * 6️⃣ Recuperar información completa del pago
     * ============================================================
     */
    const paymentClient = new Payment(client);
    const paymentInfo = await paymentClient.get({ id: paymentId });

    console.log("💳 Información del pago:", {
      id: paymentInfo.id,
      status: paymentInfo.status,
      external_reference: paymentInfo.external_reference
    });

    /**
     * ============================================================
     * 7️⃣ Validar aprobación del pago
     * ============================================================
     */
    if (paymentInfo.status !== "approved") {
      console.log("⏳ Pago aún no aprobado:", paymentInfo.status);
      return;
    }

    /**
     * ============================================================
     * 8️⃣ Ejecutar lógica de negocio
     * Activar tickets asociados a la compra
     * ============================================================
     */
    const externalReference = paymentInfo.external_reference;

    if (!externalReference) {
      console.warn("⚠️ Pago aprobado sin external_reference.");
      return;
    }

    console.log("✅ Pago aprobado. Activando tickets...");

    await ticketBuffer(externalReference);

    console.log("🎟️ Tickets activados correctamente:", externalReference);

  } catch (error) {

    /**
     * ============================================================
     * 9️⃣ Manejo de errores
     * ============================================================
     */
    console.error("❌ Error procesando webhook:", error);

  }
};