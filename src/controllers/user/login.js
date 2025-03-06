const { User } = require('../../db');
const comparePassword = require('../user/comparePassword');

const MAX_FAILED_ATTEMPTS = 12; // Número máximo de intentos fallidos

module.exports = async (req, res) => {
  try {
    const { mail, password } = req.body; // Extraer email y password desde el body
    console.log(mail)

    if (!mail || !password) {
      return res.status(400).json({ error: "Se requieren mail y password" });
    }

    // **Paso 1: Buscar User por email**
    const user = await User.findOne({ where: { email: mail } });

    if (!user) {
      return res.status(404).json({ error: `No se encontró ningún usuario registrado con el email "${mail}".` });
    }

    // **Paso 2: Manejo de intentos fallidos**
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      return res.status(403).json({ error: "Cuenta bloqueada por demasiados intentos fallidos. Contacta con soporte." });
    }

    // **Paso 3: Comparar la contraseña con el hash almacenado**
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      // Incrementar intentos fallidos y actualizar en la base de datos
      await user.update({ failedAttempts: user.failedAttempts + 1 });
      return res.status(401).json({ error: `Contraseña incorrecta. Intentos restantes: ${MAX_FAILED_ATTEMPTS - user.failedAttempts - 1}` });
    }

    // **Paso 4: Restablecer intentos fallidos si el login es exitoso**
    if (user.failedAttempts > 0) {
      await user.update({ failedAttempts: 0 });
    }

    // **Paso 5: Retornar el usuario autenticado (sin exponer la contraseña)**
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user
    });

  } catch (error) {
    console.error(`❌ Error en loginController: ${error.message}`);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
