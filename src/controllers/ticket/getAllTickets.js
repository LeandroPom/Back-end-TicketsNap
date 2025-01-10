const { Ticket } = require('../../db');

module.exports = async () => {
  try {
    // Recuperar todos los tickets
    const tickets = await Ticket.findAll();

    return tickets;
  } catch (error) {
    console.error('Error al recuperar las zonas:', error.message);
    throw new Error('No se pudo recuperar los tickets.');
  }
};


