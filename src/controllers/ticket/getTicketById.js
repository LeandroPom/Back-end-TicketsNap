const { Ticket } = require('../../db');


module.exports = async (id) => {
  // Validar que el ID sea numérico
  if (!/^\d+$/.test(id)) {
    throw { code: 400, message: 'Invalid ID format. ID must be a numeric value.' };
  }

  // Consultar el usuario por ID
  const ticket = await Ticket.findByPk(id);

  // Si el usuario no existe
  if (!ticket) {
    throw { code: 404, message: `User with ID ${id} not found.` };
  }


  // Formatear la respuesta
  return ticket
};
