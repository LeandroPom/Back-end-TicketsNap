const { User } = require('../../db');

module.exports = async (name, email, phone, password, image, cashier, admin) => {
  // Validar el nombre
  if (!name || name.length > 40) {
    throw new Error("Name is required and must not exceed 40 characters");
  }

  // Validar el email
  if (!email.includes("@")) {
    throw new Error("Invalid email format: must contain '@'");
  }

  // Verificar duplicados en el email
  const emailExists = await User.findOne({ where: { email } });
  if (emailExists) {
    throw new Error("Email already registered");
  }

  // Verificar duplicados en el nombre
  const nameExists = await User.findOne({ where: { name } });
  if (nameExists) {
    throw new Error("Name already registered");
  }

  // Crear un nuevo usuario con valores por defecto
  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    image: image || null,
    cashier: cashier || false,
    confirmed: false,
    disabled: false,
    isAdmin: admin || false,
  });

  return newUser;
};
