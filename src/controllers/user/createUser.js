const { User } = require('../../db');
const hashPassword = require('../user/hashPassword'); // Importar el hasheo

module.exports = async (name, email, phone, password, image, cashier, admin, google) => {
  try {
    // **Validaciones de entrada**
    if (!name || name.length > 40) {
      throw new Error("El nombre es obligatorio y no debe exceder los 40 caracteres.");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Formato de correo inválido: debe contener '@'.");
    }

    let hashedPassword;
    if (google) {
      // Si es un usuario de Google, la contraseña es el nombre de usuario
      hashedPassword = await hashPassword(name);
    } else {
      if (!password || password.length < 6 || password.length > 100) {
        throw new Error("La contraseña debe tener entre 6 y 100 caracteres.");
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error("La contraseña debe contener al menos una letra y un número.");
      }
      
      hashedPassword = await hashPassword(password);
    }

    // **Verificar duplicados en la base de datos**
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) throw new Error("El email ya está registrado.");

    const nameExists = await User.findOne({ where: { name } });
    if (nameExists) throw new Error("El nombre de usuario ya está registrado.");

    // **Crear usuario en la base de datos**
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Guardar contraseña hasheada
      phone: google ? null : phone, // Omitir teléfono si es cuenta de Google
      image: image || null,
      cashier: cashier || false,
      confirmed: google ? true : false, // Si es Google, el correo ya está confirmado
      disabled: false,
      isAdmin: admin || false,
      google: google, // Guardar si el usuario proviene de Google
    });

    return newUser;
  } catch (error) {
    console.error("❌ Error en createUser:", error.message);
    throw new Error(error.message);
  }
};
