const { Place } = require('../../db');

module.exports = async (name) => {
  // Validar el parámetro name
  if (!name || typeof name !== 'string') {
    throw { code: 400, message: 'Invalid or missing "name" parameter' };
  }

  try {
    // Buscar los lugares que coincidan con el nombre
    const places = await Place.findAll({
      where: { name },
      attributes: [
            // 'id', 'name', 'address', 'capacity', 'layout', 'state'
        ], // Campos específicos
    });

    // Si no se encuentran resultados, lanzar un mensaje
    if (!places.length) {
      throw { code: 404, message: `No places found with the name "${name}"` };
    }

    return places;
  } catch (error) {
    // Manejar errores generales
    throw { code: 500 }; // Error inesperado
  }
};
