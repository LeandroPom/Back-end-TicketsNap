const { Ticket, GeneralZone } = require('../../db');

module.exports = async (ticketId) => {
  try {
    console.log(ticketId);

    // **Paso 1: Validar ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);

    // **Paso 2: Validar GeneralZone**
    const zone = await GeneralZone.findByPk(ticket.zoneId);
    if (!zone) throw new Error(`La zona con ID "${ticket.zoneId}" no existe.`);

    // **Paso 3: Reducir ocupación en la división correspondiente**
    const updatedLocation = zone.location.map((division) => {
      if (division.division === ticket.division) {
        return { ...division, occupied: Math.max(0, division.occupied - 1) };
      }
      return division;
    });

    // **Paso 4: Actualizar la zona en la base de datos**
    await GeneralZone.update(
      { location: updatedLocation },
      { where: { id: ticket.zoneId } }
    );

    // **Paso 5: Actualizar el estado del ticket a 'false'**
    await Ticket.update(
      { state: false },
      { where: { id: ticketId } }
    );

    return { message: `El ticket con ID "${ticketId}" fue cancelado y el espacio ha sido liberado.` };

  } catch (error) {
    console.error(`Error al cancelar el ticket: ${error.message}`);
    throw new Error(`Error al cancelar el ticket: ${error.message}`);
  }
};
