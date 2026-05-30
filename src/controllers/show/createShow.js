// controllers/show/createShow.js
const { Show, Tag } = require('../../db');

// Validar horarios
const isValidTimeRange = (start, end) => {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;

  return (
    startInMinutes >= 0 &&
    startInMinutes <= 1439 &&
    endInMinutes >= 0 &&
    endInMinutes <= 1439 &&
    (startInMinutes < endInMinutes || endInMinutes < startInMinutes)
  );
};

module.exports = async (
  name,
  artists,
  genre,
  location,
  presentation,
  description,
  coverImage,
  isGeneral,
  templateName,
  serviceCharge
) => {

  if (!name || name.length > 125) {
    throw { code: 400, message: 'Name is required and must not exceed 125 characters' };
  }

  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    throw { code: 400, message: 'Artists must be a non-empty array' };
  }

  if (!genre || !Array.isArray(genre) || genre.length === 0) {
    throw { code: 400, message: 'Genre must be a non-empty array' };
  }

  if (!presentation || !Array.isArray(presentation) || presentation.length === 0) {
    throw { code: 400, message: 'Presentation must be a non-empty array of objects' };
  }

  if (!location) {
    throw { code: 400, message: 'Location must be provided' };
  }

  // Validar presentaciones
  presentation.forEach(({ date, performance, time }) => {
    if (!date || !performance || !time || !time.start || !time.end) {
      throw { code: 400, message: 'Each presentation must have date, performance, and time (with start and end)' };
    }

    if (!isValidTimeRange(time.start, time.end)) {
      throw { code: 400, message: `Invalid time range in presentation: ${time.start} - ${time.end}` };
    }
  });

  // Validar duplicados
  const existingShow = await Show.findOne({ where: { name } });
  if (existingShow) {
    throw { code: 409, message: 'Show with this name already exists' };
  }

  // Normalizar gÃ©neros
  const normalizedGenres = genre.map(tag =>
    tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
  );

  const existingTags = await Tag.findAll({
    where: { name: normalizedGenres },
    attributes: ['name']
  });

  const existingTagNames = existingTags.map(tag => tag.name);

  const invalidGenres = normalizedGenres.filter(tag => !existingTagNames.includes(tag));

  if (invalidGenres.length > 0) {
    throw { code: 400, message: `Invalid genres: ${invalidGenres.join(', ')}` };
  }

  // Crear show
  const newShow = await Show.create({
    name,
    artists,
    genre: normalizedGenres,
    location,
    presentation,
    description: description || null,
    coverImage: coverImage || null,
    isGeneral: isGeneral || false,
    template: templateName || null,
    serviceCharge: serviceCharge ?? 0
  });

  return newShow.dataValues;
};