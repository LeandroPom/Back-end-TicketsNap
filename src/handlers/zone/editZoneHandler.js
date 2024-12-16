// Importar el controlador editZone
const editZone = require('../../controllers/zone/editZone');

module.exports = async (req, res) => {
  // **Paso 1: Extraer datos del cuerpo de la solicitud**
  const { id, zoneName, updates } = req.body;

    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    // }


  // **Paso 2: Validar que se envíe al menos un identificador**
  if (!id && !zoneName) {
    return res.status(400).json({
      error: 'Debes proporcionar un "id" o "zoneName" para localizar la zona.',
    });
  }

  // **Paso 3: Validar que updates sea un objeto**
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({
      error: 'Debes proporcionar un objeto de "updates" con los campos a modificar.',
    });
  }

  try {
    // **Paso 4: Llamar al controlador para editar la zona**
    const updatedZone = await editZone({ id, zoneName }, updates);

    // **Paso 5: Enviar la respuesta al cliente**
    res.status(200).json({
      message: 'Zona actualizada exitosamente',
      zone: updatedZone,
    });
  } catch (error) {
    // **Paso 6: Manejo de errores personalizados**
    res.status(500).json({
      error: 'Error al actualizar la zona',
      details: error.message,
    });
  }
};
