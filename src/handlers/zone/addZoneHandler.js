const addZone  = require('../../controllers/zone/addZone');

module.exports = async (req, res) => {
  try {
    const { showId, updates, zoneName } = req.body;

    const templateName = zoneName.charAt(0).toUpperCase() + zoneName.slice(1).toLowerCase();

    // **Validaciones iniciales de los datos de entrada**
    if (!showId) {
      return res.status(400).json({ error: 'Debes proporcionar un "showId".' });
    }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Debes proporcionar un objeto "updates".' });
    }

    // Llamar al controlador y manejar la respuesta
    const result = await addZone({ showId, updates, templateName });

    return res.status(201).json({
      message: 'Zona creada o actualizada exitosamente.',
      newZone: result,
    });
  } catch (error) {
    console.error('Error en el handler addZone:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
};

