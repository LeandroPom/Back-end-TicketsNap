const bcrypt = require('bcrypt');

module.exports = async (inputPassword, storedHash) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedHash);
    return isMatch; // Retorna true si coinciden, false si no
  } catch (error) {
    console.error("❌ Error al comparar la contraseña:", error);
    throw new Error("Error al verificar la contraseña.");
  }
};
