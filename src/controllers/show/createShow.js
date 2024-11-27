// controllers/show/createShow.js
const { Show, Tag } = require('../../db');

module.exports = async (name, artists, genre, location, presentation, description, coverImage) => {

  // Validar campos obligatorios
  if (!name || name.length > 125) {
    throw new Error('Name is required and must not exceed 125 characters');
  }
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    throw new Error('Artists must be a non-empty array');
  }
  if (!genre || !Array.isArray(genre) || genre.length === 0) {
    throw new Error('Genre must be a non-empty array');
  }
  if (!location || typeof location !== 'string') {
    throw new Error('Location must be a valid string');
  }
  if (!presentation || !Array.isArray(presentation) || presentation.length === 0) {
    throw new Error('presentation must be a non-empty array of objects');
  }

  // Validar duplicados por nombre
  const existingShow = await Show.findOne({ where: { name } });
  if (existingShow) {
    throw new Error('Show with this name already exists');
  }

  // Validar que los géneros existan en la base de datos (case-insensitive)
  const normalizedGenres = genre.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());
  const existingTags = await Tag.findAll({
    where: { name: normalizedGenres },
    attributes: ['name'],
  });
  const existingTagNames = existingTags.map(tag => tag.name);

  const invalidGenres = normalizedGenres.filter(tag => !existingTagNames.includes(tag));
  if (invalidGenres.length > 0) {
    throw new Error(`Invalid genres: ${invalidGenres.join(', ')}`);
  }

  // Crear el registro
  const newShow = await Show.create({
    name,
    artists,
    genre: normalizedGenres,
    location,
    presentation: presentation,
    description: description || null,
    coverImage: coverImage || null,
    creationDate: new Date(), // Fecha manual de creación
  });

  return newShow.dataValues;
};
