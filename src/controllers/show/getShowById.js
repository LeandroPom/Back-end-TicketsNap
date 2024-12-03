const { Show, Ticket, Place } = require('../../db');

module.exports = async (id) => {
  // Validar ID
  if (!/^\d+$/.test(id)) {
    throw { code: 400, message: 'Invalid ID format' };
  }

  try {
    // Buscar el show por ID, incluyendo Tickets y Place
    const show = await Show.findByPk(id, {
      include: [
        {
          model: Ticket,
          attributes: ['id', 'row'],
        },
        {
          model: Place,
          attributes: ['id', 'capacity', 'address'],
        },
      ],
    });

    // Si no se encuentra el Show
    if (!show) {
      throw { code: 400, message: `Show with ID ${id} not found` };
    }

    // Revisar relaciones con otros modelos y agregar mensajes si faltan
    if (!show.Tickets || show.Tickets.length === 0) {
      show.setDataValue('Tickets', { message: 'No tickets found for this show.' });
    }

    if (!show.Place) {
      show.setDataValue('Place', { message: 'Place information not available.' });
    }

    return show;
  } catch (error) {
    // Manejo de errores generales
    throw error.code ? error : { code: 500, message: 'An unexpected error occurred' };
  }
};
