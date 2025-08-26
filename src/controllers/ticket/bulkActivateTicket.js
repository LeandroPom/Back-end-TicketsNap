require("dotenv").config();
const QRCode = require("qrcode");
const sendTicketsEmail = require("../mailer/sendTicketEmail");
const seatManager = require("./seatManager");
const { Ticket, Show } = require("../../db");

module.exports = async (externalReference) => {
  try {
    // **Paso 1: Extraer ticketIds, zoneId, showId y mail**
    const regex = /ticketId:\s*([\d,]+),\s*zoneId:\s*(\d+),\s*showId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = externalReference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const ticketIds = match[1].split(",").map(id => parseInt(id.trim(), 10));
    // const zoneId = parseInt(match[2], 10); // No se usa ahora, pero lo dejamos para compatibilidad
    const showId = parseInt(match[3], 10);
    // const mail = match[4]; // 🔹 El mail ya viene en cada ticket guardado

    // **Paso 2: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    const activatedTickets = [];

    // **Paso 3: Recorrer todos los tickets**
    for (const ticketId of ticketIds) {
      const ticket = await Ticket.findByPk(ticketId);
      if (!ticket) {
        console.warn(`⚠️ Ticket con ID "${ticketId}" no encontrado. Saltando...`);
        continue;
      }


      // **Paso 4: Activar ticket**
      await Ticket.update({ state: true }, { where: { id: ticketId } });
      console.log(`🎟️ Ticket con ID ${ticketId} activado correctamente.`);

      // **Paso 5: Generar QR**
      const qrUrl = `${process.env.FRONTEND_URL}/tickets/useQR/${ticketId}`;
      const qrCode = await QRCode.toDataURL(qrUrl);

      // **Paso 6: Guardar QR**
      await Ticket.update({ qrCode }, { where: { id: ticketId } });
      console.log(`🎟️ QR generado para el Ticket con ID ${ticketId}.`);

      // **Paso 7: Preparar datos para correo (pero no enviamos aún)**
      const ticketActive = await Ticket.findByPk(ticketId);
      activatedTickets.push({
        ...ticketActive.toJSON(),
        qrCode,
        state: true,
        showName: show.name,
      });


    }

    // **Paso 8: Enviar un solo correo con todos los tickets**
    if (activatedTickets.length > 0) {
      // Convertir array de IDs a array de objetos con ticketId
      const ticketsForSeatManager = ticketIds.map(id => ({ ticketId: id }));
      await seatManager(ticketsForSeatManager, "buy");
      await sendTicketsEmail(activatedTickets);
    }

    // **Paso 9: Retornar lista de tickets activados**
    return activatedTickets;

  } catch (error) {
    console.error(`❌ Error en bulkActivateTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};
