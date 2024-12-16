const getAllZones = require('../../controllers/zone/getAllZones');


module.exports = async (req, res) => {
  try {
    // Llamada al controlador para obtener todas las zonas
    const zones = await getAllZones();

    if (!zones || zones.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron zonas en la base de datos.',
      });
    }

    res.status(200).json({
      message: 'Zonas recuperadas exitosamente',
      zones,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al recuperar las zonas',
      details: error.message,
    });
  }
};

