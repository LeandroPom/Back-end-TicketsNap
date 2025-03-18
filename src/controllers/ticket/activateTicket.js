require("dotenv").config();
const QRCode = require('qrcode');
const sendTicketEmail = require("../mailer/sendTicketEmail");
const { Ticket, Zone, Show } = require('../../db');

module.exports = async (externalReference) => {
  try {
    // **Paso 1: Extraer ticketId, zoneId y mail desde externalReference**
    const regex = /ticketId:\s*(\d+),\s*zoneId:\s*(\d+),\s*showId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = externalReference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const ticketId = parseInt(match[1], 10);
    const zoneId = Number(match[2]); // Convertir zoneId a número explícitamente
    const showId = match[3];
    const mail = match[4];

    // **Paso 2: Validar Ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);

    // **Paso 3: Validar Zona**
    const zone = await Zone.findByPk(zoneId);
    if (!zone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // **Paso 4: Validar Show**
    const show = await Show.findByPk(showId);
    if (!show) throw new Error(`El show con ID "${showId}" no existe.`);

    if (ticket.division === "Tribunas Generales") {

      // **Paso 5A: Buscar la división en la zona y actualizar ocupación**
      const updatedLocation = zone.location.map(div => {
        if (div.division === ticket.division) {
          return { ...div, occupied: div.occupied + 1 };
        }
        return div;
      });

      // **Paso 6A: Actualizar la zona en la base de datos**
      await Zone.update(
        { location: updatedLocation },
        { where: { id: zoneId } }
      );

    } else {

      // **Paso 4B: Convertir ticket.row y ticket.seat a números**
      const ticketRow = Number(ticket.row);
      const ticketSeat = Number(ticket.seat);

      // **Paso 5B: Buscar el asiento en la zona y marcarlo como ocupado**
      let seatUpdated = false;

      const updatedLocation = zone.location.map(div => {
        if (div.division === ticket.division) {
          div.rows = div.rows.map(row => {
            if (row.row === ticketRow) {  // 🔹 Convertido a Number
              row.seats = row.seats.map(seat => {
                if (seat.id === ticketSeat) {  // 🔹 Convertido a Number
                  seatUpdated = true;
                  return { ...seat, taken: true }; // ✅ Marcar asiento como ocupado
                }
                return seat;
              });
            }
            return row;
          });
        }
        return div;
      });

      if (!seatUpdated) {
        throw new Error(`No se encontró el asiento con ID "${ticket.seat}" en la fila "${ticket.row}" de la división "${ticket.division}".`);
      }

      // **Paso 6B: Actualizar la zona en la base de datos**
      await Zone.update(
        { location: updatedLocation },
        { where: { id: zoneId } }
      );
    }

    // **Paso 7: Activar el ticket**
    await Ticket.update({ state: true }, { where: { id: ticket.id } });

    console.log(`🎟️ Ticket con ID ${ticket.id} activado correctamente.`);

    // **Paso 8: Generar código QR**
    const qrUrl = `${process.env.FRONTEND_URL}/tickets/useQR/${ticketId}`;
    const qrCode = await QRCode.toDataURL(qrUrl);

    // **Paso 9: Guardar QR en el ticket**
    await Ticket.update({ qrCode: qrCode }, { where: { id: ticketId } });

    console.log(`🎟️ QR generado para el Ticket con ID ${ticketId}.`);

    // **Paso 10: Agregar `showName` temporalmente y enviar el correo**
    const ticketActive = await Ticket.findByPk(ticketId);

    const ticketWithShowName = { ...ticketActive.toJSON(), showName: show.name };

    await sendTicketEmail(ticketWithShowName);

    // **Paso 11: Retornar el Ticket activado**
    return ticketActive;

  } catch (error) {
    console.error(`❌ Error en activateTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};
