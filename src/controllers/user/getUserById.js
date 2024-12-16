const { User, Ticket } = require('../../db');

module.exports = async (id) => {
  // Validar que el ID sea numérico
  if (!/^\d+$/.test(id)) {
    throw { code: 400, message: 'Invalid ID format. ID must be a numeric value.' };
  }

  // Consultar el usuario por ID
  const user = await User.findByPk(id, {
    attributes: {
      exclude: ['password'] // Excluir el campo sensible `password`
    },
    include: [
      {
        model: Ticket,
        attributes: ['id', 'price', 'state', 'date'], // Incluir campos relevantes de Ticket
      }
    ]
  });

  // Si el usuario no existe
  if (!user) {
    throw { code: 404, message: `User with ID ${id} not found.` };
  }

  // Verificar si el usuario tiene tickets
  const tickets = user.Tickets;
  if (!tickets || tickets.length === 0) {
    return {
      user: user.toJSON(),
      message: 'The requested user has no tickets.'
    };
  }

  // Formatear la respuesta
  return {
    user: user.toJSON(),
    tickets
  };
};
