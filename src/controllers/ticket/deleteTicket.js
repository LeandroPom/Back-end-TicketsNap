const { Ticket } = require('../../db');

module.exports = async (externalReference) => {
  try {
    // **Paso 1: Extraer ticketId desde externalReference**
    const regex = /ticketId:\s*(\d+),\s*zoneId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = externalReference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const ticketId = parseInt(match[1], 10);

    // **Paso 2: Validar Ticket**
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) throw new Error(`El ticket con ID "${ticketId}" no existe.`);

    // **Paso 3: Eliminar el Ticket**
    await Ticket.destroy({ where: { id: ticketId } });

    console.log(`🗑️ Ticket con ID ${ticketId} eliminado correctamente.`);

    return { message: `Ticket con ID ${ticketId} eliminado correctamente.` };

  } catch (error) {
    console.error(`❌ Error en deleteTicket: ${error.message}`);
    throw new Error(error.message);
  }
};
