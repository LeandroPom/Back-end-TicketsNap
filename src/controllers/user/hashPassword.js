const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10; // Definimos la cantidad de rondas para encriptar

module.exports = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error("❌ Error al hashear la contraseña:", error);
    throw new Error("Error al procesar la contraseña.");
  }
};
