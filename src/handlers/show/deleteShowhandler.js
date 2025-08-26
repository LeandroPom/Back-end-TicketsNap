const deleteShow = require('../../controllers/show/deleteShow');

module.exports = async (req, res) => {
  try {
    const { showId } = req.params;
    console.log(showId)

    // Validar que el ID del show fue proporcionado
    if (!showId) {
      return res.status(400).json({ error: 'Debes proporcionar un showId.' });
    }

    // Llamar al controlador para eliminar el show
    const result = await deleteShow(showId);

    return res.status(200).json(result);

  } catch (error) {

    console.error(`Error en deleteShowHandler: ${error.message}`);
    
    return res.status(500).json({
      error: 'Error al eliminar el show y los tickets asociados.',
      details: error.message
    });
  }
};
