const cancelShow = require('../../controllers/show/disableShow');

module.exports = async (req, res) => {
  try {
    const { showId } = req.params;

    // Validar que el ID del show fue proporcionado
    if (!showId) {
      return res.status(400).json({ error: 'Debes proporcionar un showId.' });
    }

    // Llamar al controlador para desactivar el show
    const result = await cancelShow(showId);

    return res.status(200).json(result);

  } catch (error) {

    console.error(`Error en cancelShowHandler: ${error.message}`);
    
    return res.status(500).json({
      error: 'Error al cancelar el show.',
      details: error.message
    });
  }
};
