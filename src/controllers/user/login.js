require('dotenv').config();
const { User } = require('../../db');
const comparePassword = require('../user/comparePassword');
const jwt = require('jsonwebtoken');

const MAX_FAILED_ATTEMPTS = 99;

module.exports = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail) {
      return res.status(400).json({ error: "Se requiere mail" });
    }

    // Buscar usuario por email
    const user = await User.findOne({ where: { email: mail } });
    if (!user) {
      return res.status(404).json({ error: `No se encontró ningún usuario con el email "${mail}".` });
    }

    // Verificar si la cuenta está bloqueada
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      return res.status(403).json({ error: "Cuenta bloqueada por demasiados intentos fallidos. Contacta con soporte." });
    }

    // ===== LOGIN CON GOOGLE =====
    if (!password) {
      if (user.disabled) {
        return res.status(403).json({ error: "Cuenta bloqueada. Contacta con soporte." });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          cashier: user.cashier,
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        message: "Inicio de sesión exitoso (Google)",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          cashier: user.cashier,
          disabled: user.disabled,
          image: user.image
        }
      });
    }

    // ===== LOGIN NORMAL =====
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      await user.update({ failedAttempts: user.failedAttempts + 1 });
      return res.status(401).json({
        error: `Contraseña incorrecta. Intentos restantes: ${MAX_FAILED_ATTEMPTS - user.failedAttempts - 1}`
      });
    }

    // Resetear intentos fallidos
    if (user.failedAttempts > 0) {
      await user.update({ failedAttempts: 0 });
    }

    // Crear JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        cashier: user.cashier,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Respuesta (login normal)
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cashier: user.cashier,
        disabled: user.disabled,
        image: user.image
      }
    });

  } catch (error) {
    console.error(`❌ Error en loginController: ${error.message}`);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
