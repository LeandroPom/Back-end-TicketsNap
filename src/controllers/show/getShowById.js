const { Show, Ticket, Place } = require('../../db');

module.exports = async (id) => {
  // Validar ID
  if (!/^\d+$/.test(id)) {
    throw { code: 400, message: 'Invalid ID format' };
  }

  try {
    // Buscar el show por ID, incluyendo Tickets y Place
    const show = await Show.findByPk(id);

    // Si no se encuentra el Show
    if (!show) {
      throw { code: 400, message: `Show with ID ${id} not found` };
    }

    return show;
  } catch (error) {
    // Manejo de errores generales
    throw error.code ? error : { code: 500, message: 'An unexpected error occurred' };
  }
};
