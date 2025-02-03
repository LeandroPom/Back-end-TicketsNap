const { User } = require('../../db');
const hashPassword = require('../user/hashPassword'); // Importar el hasheo

module.exports = async (name, email, phone, password, image, cashier, admin) => {
  try {
    // **Validaciones de entrada**
    if (!name || name.length > 40) {
      throw new Error("El nombre es obligatorio y no debe exceder los 40 caracteres.");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Formato de correo inválido: debe contener '@'.");
    }

    if (!password || password.length < 6 || password.length > 100) {
      throw new Error("La contraseña debe tener entre 6 y 100 caracteres.");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error("La contraseña debe contener al menos una letra y un número.");
    }

    // **Verificar duplicados en la base de datos**
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) throw new Error("El email ya está registrado.");

    const nameExists = await User.findOne({ where: { name } });
    if (nameExists) throw new Error("El nombre de usuario ya está registrado.");

    // **Hashear la contraseña antes de guardarla en la base de datos**
    const hashedPassword = await hashPassword(password);

    // **Crear usuario en la base de datos**
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Guardar contraseña hasheada
      phone,
      image: image || null,
      cashier: cashier || false,
      confirmed: false,
      disabled: false,
      isAdmin: admin || false,
    });

    return newUser;

  } catch (error) {
    console.error("❌ Error en createUser:", error.message);
    throw new Error(error.message);
  }
};
