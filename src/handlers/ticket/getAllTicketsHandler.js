const getAllTickets = require('../../controllers/ticket/getAllTickets');


module.exports = async (req, res) => {
  try {
    // Llamada al controlador para obtener todas las zonas
    const tickets = await getAllTickets();

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron tickets en la base de datos.',
      });
    }

    res.status(200).json({
      message: 'tickets recuperados exitosamente',
      tickets,
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Error al recuperar los tickets',
      details: error.message,
    });
  }
};