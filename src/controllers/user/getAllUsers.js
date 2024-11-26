const { User } = require('../../db');

module.exports = async () => {
  try {
    // Busca todos los usuarios
    const allUsers = await User.findAll();

    // Verifica si hay usuarios en la base de datos
    if (!allUsers.length) {
      throw new Error('No users found');
    }

    // Filtra las propiedades vacías o nulas de cada usuario
    const filteredUsers = allUsers.map(user => {
      const filteredUser = {};
      Object.entries(user.dataValues).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          filteredUser[key] = value;
        }
      });
      return filteredUser;
    });

    return filteredUsers;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};
