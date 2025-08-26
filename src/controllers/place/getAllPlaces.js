const { Place } = require('../../db');

module.exports = async () => {
  try {
    // Obtener todos los registros de la tabla Place
    const places = await Place.findAll();

    if (!places.length) {
      throw new Error('No places found'); // Error si no hay registros
    }

    return places; // Devolver todos los lugares encontrados
  } catch (error) {
    throw new Error(error.message || 'Error retrieving places from database');
  }
};
