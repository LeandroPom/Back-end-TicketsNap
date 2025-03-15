require("dotenv").config();
const QRCode = require('qrcode');
const sendTicketEmail = require("../mailer/sendTicketEmail");
const { Ticket, GeneralZone, Show } = require('../../db');

module.exports = async (externalReference) => {
  try {
    // **Paso 1: Extraer datos desde externalReference**
    const regex = /ticketId:\s*(\d+),\s*zoneId:\s*(\d+),\s*showId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = externalReference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const ticketId = parseInt(match[1], 10);
    const zoneId = Number(match[2]);
    const showId = match[3];
    const mail = match[4];

    // **Paso 2: Validar Ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);

    // **Paso 3: Validar GeneralZone**
    const zone = await GeneralZone.findByPk(zoneId);
    if (!zone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // **Paso 3.5: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    // **Paso 4: Buscar la división en la zona y actualizar ocupación**
    const updatedLocation = zone.location.map(div => {
      if (div.division === ticket.division) {
        return { ...div, occupied: div.occupied + 1 };
      }
      return div;
    });

    // **Paso 5: Actualizar la zona en la base de datos**
    await GeneralZone.update(
      { location: updatedLocation },
      { where: { id: zoneId } }
    );

    // **Paso 6: Activar el ticket**
    await Ticket.update({ state: true }, { where: { id: ticket.id } });

    console.log(`🎟️ Ticket con ID ${ticket.id} activado correctamente.`);

    // **Paso 7: Generar código QR**
    const qrUrl = `https://ticketsnap.loca.lt/tickets/useQR/${ticketId}`;
    const qrCode = await QRCode.toDataURL(qrUrl);
    

    // **Paso 8: Guardar QR en el ticket**
    await Ticket.update({ qrCode: qrCode }, { where: { id: ticketId } });

    console.log(`🎟️ QR generado para el Ticket con ID ${ticketId}.`);

    // **Paso 9: Enviar el correo con el ticket**
    const ticketActive = await Ticket.findByPk(ticketId);
    const ticketWithShowName = { ...ticketActive.toJSON(), showName: show.name };

    await sendTicketEmail(ticketWithShowName);

    return ticket;

  } catch (error) {
    console.error(`❌ Error en activateGEneralTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};
