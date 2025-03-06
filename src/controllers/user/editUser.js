// Importar el modelo User desde la base de datos
const { User } = require('../../db');
const hashPassword = require('../user/hashPassword'); // Importar el hasheo

module.exports = async (identifier, updates) => {
  try {
    // **Paso 1: Verificar identificador**
    if (!identifier || (!identifier.id && !identifier.email)) {
      throw { status: 400, message: 'Debes proporcionar un "id" o "email" para localizar al usuario.' };
    }

    // **Paso 2: Buscar el usuario por id o email**
    const user = await User.findOne({
      where: {
        ...(identifier.id && { id: identifier.id }),
        ...(identifier.email && { email: identifier.email }),
      },
    });

    if (!user) {
      throw { status: 404, message: 'No se encontró ningún usuario con el identificador proporcionado.' };
    }

    // **Paso 3: Validar estado del usuario**
    // if (user.disabled) {
    //   throw { status: 400, message: 'La cuenta del usuario está deshabilitada y no se puede editar.' };
    // }

    // **Paso 4: Validar valores únicos (email, phone)**
    if (updates.email && updates.email !== user.email) {
      const existingEmail = await User.findOne({ where: { email: updates.email } });
      if (existingEmail) {
        throw { status: 400, message: 'El email proporcionado ya está en uso por otro usuario.' };
      }
    }

    if (updates.phone && updates.phone !== user.phone) {
      const existingPhone = await User.findOne({ where: { phone: updates.phone } });
      if (existingPhone) {
        throw { status: 400, message: 'El número de teléfono proporcionado ya está en uso por otro usuario.' };
      }
    }

    // **Paso 5: Actualizar campos válidos**
    const fieldsToUpdate = { ...updates };
    delete fieldsToUpdate.id; // Eliminar `id` si está presente en updates

    // **Paso 5: Validar y hashear la contraseña si se actualiza**
    if (fieldsToUpdate.password) {
      if (fieldsToUpdate.password.length < 6 || fieldsToUpdate.password.length > 100) {
        throw { status: 400, message: "La contraseña debe tener entre 6 y 100 caracteres." };
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!passwordRegex.test(fieldsToUpdate.password)) {
        throw { status: 400, message: "La contraseña debe contener al menos una letra y un número." };
      }

      fieldsToUpdate.password = await hashPassword(fieldsToUpdate.password);
      console.log("🔒 Contraseña hasheada correctamente.");
    }

    await user.update(fieldsToUpdate);

    // **Paso 6: Retornar el usuario actualizado**
    return user;
  } catch (error) {
    // **Manejo de errores personalizados**
    throw { status: error.status || 500, message: error.message || 'Error al actualizar el usuario.' };
  }
};
