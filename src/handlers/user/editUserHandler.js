// Importar el controlador editUser
const editUser = require('../../controllers/user/editUser');

module.exports = async (req, res) => {
  // **Paso 1: Extraer datos del cuerpo de la solicitud**
  const { id, email, updates } = req.body;

  // **Paso 2: Validar que se envíe un identificador**
  if (!id && !email) {
    return res.status(400).json({
      error: 'Debes proporcionar un "id" o "email" para localizar al usuario.',
    });
  }

  // **Paso 3: Validar que updates sea un objeto**
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({
      error: 'Debes proporcionar un objeto de "updates" con los campos a modificar.',
    });
  }


  try {
    // **Paso 5: Llamar al controlador para editar el usuario**
    const updatedUser = await editUser({ id, email }, updates);

    // **Paso 6: Responder al cliente**
    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser,
    });

    // **Log de éxito**
    console.log(`Usuario actualizado exitosamente:`, updatedUser.dataValues);
  } catch (error) {
    // **Manejo de errores personalizados**
    res.status(error.status || 500).json({
      error: error.message || 'Error al actualizar el usuario',
    });
  }
};
