const { Ticket, Zone } = require('../../db');

module.exports = async (ticketId) => {
  try {
    console.log(ticketId)

    // **Paso 1: Validar ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);

    // **Paso 2: Validar Zona**
    const zone = await Zone.findByPk(ticket.zoneId);
    if (!zone) throw new Error(`La zona con ID "${ticket.zoneId}" no existe.`);

    // **Paso 3A: Reducir ocupación en la división correspondiente**
    if (ticket.division === "Tribunas Generales") {

      const updatedLocation = zone.location.map((division) => {
        if (division.division === ticket.division) {
          return { ...division, occupied: Math.max(0, division.occupied - 1) };
        }
        return division;
      });

      // **Paso 4A: Actualizar la zona en la base de datos**
      await Zone.update(
        { location: updatedLocation },
        { where: { id: ticket.zoneId } }
      );

      // **Paso 5A: Actualizar el estado del ticket a 'false'**
      await Ticket.update(
        { state: false },
        { where: { id: ticketId } }
      );

      return { message: `El ticket con ID "${ticketId}" fue cancelado y el espacio ha sido liberado.` };
    }

    // **Paso 3: Marcar el asiento como disponible (taken: false)**
    const updatedLocation = zone.location.map((division) => {
      if (division.division === ticket.division) {
        division.rows = division.rows.map((row) => {
          if (row.row === parseInt(ticket.row)) { // Asegurar tipo numérico
            row.seats = row.seats.map((seat) => {
              if (seat.id === parseInt(ticket.seat)) {
                return { ...seat, taken: false }; // Liberar el asiento
              }
              return seat;
            });
          }
          return row;
        });
      }
      return division;
    });

    // **Paso 4: Actualizar la zona en la base de datos**
    await Zone.update(
      { location: updatedLocation },
      { where: { id: ticket.zoneId } }
    );

    // **Paso 5: Actualizar el estado del ticket a 'false'**
    await Ticket.update(
      { state: false },
      { where: { id: ticketId } }
    );

    return { message: `El ticket con ID "${ticketId}" fue cancelado y el asiento ha sido liberado.` };

  } catch (error) {
    console.error(`Error al cancelar el ticket: ${error.message}`);
    throw new Error(`Error al cancelar el ticket: ${error.message}`);
  }
};
