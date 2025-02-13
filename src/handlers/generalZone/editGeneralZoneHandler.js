// Importar el controlador editGeneralZone
const editGeneralZone = require('../../controllers/generalZone/editGeneralZone');

module.exports = async (req, res) => {
  // **Paso 1: Extraer datos del cuerpo de la solicitud**
  const { id, showId, updates } = req.body;

  // **Paso 2: Validar que se envíe al menos un identificador**
  if (!id && !showId) {
    return res.status(400).json({
      error: 'Debes proporcionar un "id" o "showId" para localizar la zona.',
    });
  }

  // **Paso 3: Validar que updates sea un objeto**
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({
      error: 'Debes proporcionar un objeto de "updates" con los campos a modificar.',
    });
  }

  try {
    // **Paso 4: Llamar al controlador para editar la zona general**
    const updatedGeneralZone = await editGeneralZone({ id, showId }, updates);

    // **Paso 5: Enviar la respuesta al cliente**
    res.status(200).json({
      message: 'Zona general actualizada exitosamente',
      generalZone: updatedGeneralZone,
    });
  } catch (error) {
    // **Paso 6: Manejo de errores personalizados**
    res.status(500).json({
      error: 'Error al actualizar la zona general',
      details: error.message,
    });
  }
};
