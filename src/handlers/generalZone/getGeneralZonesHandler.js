const getAllGeneralZones = require('../../controllers/generalZone/getGeneralZones');

module.exports = async (req, res) => {
  try {
    // Llamada al controlador para obtener todas las zonas generales
    const generalZones = await getAllGeneralZones();

    if (!generalZones || generalZones.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron zonas generales en la base de datos.',
      });
    }

    res.status(200).json({
      message: 'Zonas generales recuperadas exitosamente',
      generalZones,
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al recuperar las zonas generales',
      details: error.message,
    });
    
  }
};
