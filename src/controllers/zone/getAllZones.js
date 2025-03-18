const { Zone } = require('../../db');

module.exports = async () => {
  try {
    // Recuperar todas las zonas, incluyendo los asientos
    const zones = await Zone.findAll();

    return zones;
  } catch (error) {
    console.error('Error al recuperar las zonas:', error.message);
    throw new Error('No se pudo recuperar las zonas.');
  }
};


