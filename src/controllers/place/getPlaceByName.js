const { Place } = require('../../db');
const { Op } = require('sequelize'); // Importar operadores

module.exports = async (name) => {
  // Validar el parámetro name
  if (!name || typeof name !== 'string') {
    throw { code: 400, message: 'Invalid or missing "name" parameter' };
  }

  try {
    // Buscar los lugares que contengan el nombre proporcionado (búsqueda parcial)
    const places = await Place.findAll({
      where: {
        name: { [Op.like]: `%${name}%` } // Búsqueda parcial y case-sensitive
      },
      attributes: ['id', 'state', 'name', 'address'], // Campos específicos
    });

    // Si no se encuentran resultados, lanzar un mensaje
    if (!places.length) {
      throw { code: 404, message: `No places found containing the name "${name}"` };
    }

    return places;
  } catch (error) {
    console.error('Error in getByName:', error); // Registrar errores para diagnóstico
    throw { code: 500, message: 'Internal server error' };
  }
};
