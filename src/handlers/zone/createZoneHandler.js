const createZone = require('../../controllers/zone/createZone');

module.exports = async (req, res) => {
  const { zoneName, generalTicket, presentation, location } = req.body;

  // Validar campos requeridos
  if (!zoneName || typeof generalTicket === 'undefined' || !presentation || !location) {
    return res.status(400).json({
      error: 'Faltan datos: asegúrate de incluir "zoneName", "generalTicket", "presentation" y "location".',
    });
  }

  try {
    // Llamada al controlador para crear la zona
    const newZone = await createZone(zoneName, generalTicket, presentation, location);

    res.status(201).json({
      message: 'Zona creada exitosamente',
      zone: newZone,
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear la zona',
      details: error.message,
    });
  }
};
