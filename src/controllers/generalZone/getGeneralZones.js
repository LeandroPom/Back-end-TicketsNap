const { GeneralZone } = require('../../db');

module.exports = async () => {
  try {
    // Recuperar todas las zonas, incluyendo los asientos
    const generalZones = await GeneralZone.findAll();

    return generalZones;

  } catch (error) {

    console.error('Error al recuperar las zonas generales:', error.message);
    throw new Error('No se pudo recuperar las zonas generales.');

  }
};


