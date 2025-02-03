const { Ticket, Zone } = require('../../db');

module.exports = async (ticketId, zoneId) => {
  try {
    // **Paso 1: Validar Ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);   

    // **Paso 2: Validar Zona**
    const zone = await Zone.findByPk(zoneId);
    if (!zone) throw new Error(`La zona con ID "${zoneId}" no existe.`);

    // Clonamos la ubicación para actualizarla
    let updatedLocation = [...zone.location]; 
    let rowValue = null;
    let seatValue = null;

    // Marcamos el asiento como ocupado
    updatedLocation = updatedLocation.map(div => {
      if (div.division === ticket.division) {
        div.rows = div.rows.map(r => {
          if (r.row === ticket.row) {
            r.seats = r.seats.map(seat => {
              if (seat.id === ticket.seat) {
                return { ...seat, taken: true };
              }
              return seat;
            });
          }
          return r;
        });
      }
      return div;
    });

    rowValue = ticket.row;
    seatValue = ticket.seatId;
    

    // **Paso 3: Actualizar la zona en la base de datos (única actualización)**
    await Zone.update(
      { location: updatedLocation },
      { where: { id: zoneId } }
    );

    // **Paso 4: Activar el ticket**
    await Ticket.update({ state: true }, { where: { id: ticket.id } });

    console.log(`Ticket con ID ${ticket.id} activado correctamente.`);
    
    // **Paso 5: Retornar el Ticket activado**
    return ticket;

  } catch (error) {
    console.error(`Error en sellTicketController: ${error.message}`);
    throw new Error(error.message);
  }
};