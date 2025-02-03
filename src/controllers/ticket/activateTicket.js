const { Ticket, Zone } = require('../../db');

module.exports = async (externalReference) => {
  try {
    // **Paso 1: Extraer ticketId, zoneId y mail desde externalReference**
    const regex = /ticketId:\s*(\d+),\s*zoneId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = externalReference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const ticketId = parseInt(match[1], 10);
    const zoneId = Number(match[2]); // Convertir zoneId a número explícitamente
    const mail = match[3];

    // **Paso 2: Validar Ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);

    // **Paso 3: Validar Zona**
    const zone = await Zone.findByPk(zoneId);
    if (!zone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // **Paso 4: Convertir ticket.row y ticket.seat a números**
    const ticketRow = Number(ticket.row);
    const ticketSeat = Number(ticket.seat);

    // **Paso 5: Buscar el asiento en la zona y marcarlo como ocupado**
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

    // **Paso 6: Actualizar la zona en la base de datos**
    await Zone.update(
      { location: updatedLocation },
      { where: { id: zoneId } }
    );

    // **Paso 7: Activar el ticket**
    await Ticket.update({ state: true }, { where: { id: ticket.id } });

    console.log(`🎟️ Ticket con ID ${ticket.id} activado correctamente.`);

    // **Paso 8: Retornar el Ticket activado**
    return ticket;

  } catch (error) {
    console.error(`❌ Error en sellTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};
