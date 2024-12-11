// loadSeeds.js

const { User, Place, Tag, Show, Zone } = require('../db'); // Ajusta según la ruta de tus modelos
const fs = require('fs');
const path = require('path');

// Ruta a los archivos JSON de seeds
const seedsPath = path.join(__dirname, 'seeds');

async function loadSeeds() {
  try {
    console.log('Cargando datos iniciales en la base de datos...');

    // // Usuarios
    // const usersData = JSON.parse(fs.readFileSync(path.join(seedsPath, 'users.json'), 'utf-8'));
    // for (const userData of usersData) {
    //   await User.create(userData);
    // }

    // Lugares
    const placesData = JSON.parse(fs.readFileSync(path.join(seedsPath, 'places.json'), 'utf-8'));
    for (const placeData of placesData) {
      await Place.create(placeData);
    }

    // Tags
    const tagsData = JSON.parse(fs.readFileSync(path.join(seedsPath, 'tags.json'), 'utf-8'));
    for (const tagData of tagsData) {
      await Tag.create(tagData);
    }

    // Shows
    const showsData = JSON.parse(fs.readFileSync(path.join(seedsPath, 'shows.json'), 'utf-8'));
    for (const showData of showsData) {
      await Show.create(showData);
    }

    // // Zonas
    // const zonesData = JSON.parse(fs.readFileSync(path.join(seedsPath, 'zones.json'), 'utf-8'));
    // for (const zoneData of zonesData) {
    //   await Zone.create(zoneData);
    // }

    console.log('¡Carga inicial completada!');
  } catch (error) {
    console.error('Error al cargar los datos iniciales:', error);
  }
}

module.exports = loadSeeds;
