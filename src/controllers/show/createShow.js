// controllers/show/createShow.js
const { Show, Tag, Place } = require('../../db');

// Función para validar horarios (start debe ser anterior a end, considerando cruces de medianoche)
const isValidTimeRange = (start, end) => {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  // Convertir horas a minutos para comparar
  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;

  // Verificar que los horarios estén en el rango válido (0-1439 minutos) y que start sea antes que end
  return (
    startInMinutes >= 0 &&
    startInMinutes <= 1439 &&
    endInMinutes >= 0 &&
    endInMinutes <= 1439 &&
    (startInMinutes < endInMinutes || endInMinutes < startInMinutes)
  );
};

module.exports = async (name, artists, genre, locationName, presentation, description, coverImage, price) => {
  // Validar campos obligatorios
  if (!name || name.length > 125) {
    throw { code: 400, message: 'Name is required and must not exceed 125 characters' };
  }
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    throw { code: 400, message: 'Artists must be a non-empty array' };
  }
  if (!genre || !Array.isArray(genre) || genre.length === 0) {
    throw { code: 400, message: 'Genre must be a non-empty array' };
  }
  if (!price || price < 0) {
    throw { code: 400, message: 'Price must be a positive number' };
  }
  if (!presentation || !Array.isArray(presentation) || presentation.length === 0) {
    throw { code: 400, message: 'Presentation must be a non-empty array of objects' };
  }

  // Validar la ubicación en la base de datos
  const place = await Place.findOne({ where: { name: locationName } });
  if (!place) {
    throw { code: 404, message: 'Location not found in the database' };
  }
  const location = { name: place.name, address: place.address };

  // Validar las presentaciones
  presentation.forEach(({ date, performance, time }) => {
    if (!date || !performance || !time || !time.start || !time.end) {
      throw { code: 400, message: 'Each presentation must have date, performance, and time (with start and end)' };
    }
    if (!isValidTimeRange(time.start, time.end)) {
      throw { code: 400, message: `Invalid time range in presentation: ${time.start} - ${time.end}` };
    }
  });

  // Validar duplicados por nombre
  const existingShow = await Show.findOne({ where: { name } });
  if (existingShow) {
    throw { code: 409, message: 'Show with this name already exists' };
  }

  // Validar géneros existentes
  const normalizedGenres = genre.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());
  const existingTags = await Tag.findAll({
    where: { name: normalizedGenres },
    attributes: ['name'],
  });
  const existingTagNames = existingTags.map(tag => tag.name);

  const invalidGenres = normalizedGenres.filter(tag => !existingTagNames.includes(tag));
  if (invalidGenres.length > 0) {
    throw { code: 400, message: `Invalid genres: ${invalidGenres.join(', ')}` };
  }

  // Crear el registro
  const newShow = await Show.create({
    name,
    artists,
    genre: normalizedGenres,
    location,
    presentation,
    description: description || null,
    coverImage: coverImage || null,
    price,
  });

  return newShow.dataValues;
};
