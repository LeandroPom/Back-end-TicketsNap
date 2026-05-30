// controllers/show/editShow.js
const { Show, Tag } = require('../../db');

module.exports = async (id, updates) => {
  try {

    const show = await Show.findByPk(id);

    if (!show) {
      throw { code: 404, message: 'No se encontró ningún show con el ID proporcionado.' };
    }

    const updatedFields = {};

    // presentation
    if (updates.presentation !== undefined) {

      if (!Array.isArray(updates.presentation)) {
        throw { code: 400, message: 'El campo "presentation" debe ser un arreglo.' };
      }

      updates.presentation.forEach(item => {
        if (
          typeof item.date !== 'string' ||
          !item.performance ||
          !item.time ||
          typeof item.time.start !== 'string' ||
          typeof item.time.end !== 'string'
        ) {
          throw { code: 400, message: 'Cada presentación debe tener "date", "performance", y "time" con "start" y "end".' };
        }
      });

      updatedFields.presentation = updates.presentation;
    }

    // genre
    if (updates.genre !== undefined) {

      if (!Array.isArray(updates.genre)) {
        throw { code: 400, message: 'El campo "genre" debe ser un arreglo.' };
      }

      const normalizedGenres = updates.genre.map(tag =>
        tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
      );

      const existingTags = await Tag.findAll({
        where: { name: normalizedGenres },
        attributes: ['name']
      });

      const existingTagNames = existingTags.map(tag => tag.name);

      const invalidGenres = normalizedGenres.filter(tag => !existingTagNames.includes(tag));

      if (invalidGenres.length > 0) {
        throw {
          code: 400,
          message: `Los siguientes géneros no son válidos: ${invalidGenres.join(', ')}`
        };
      }

      updatedFields.genre = normalizedGenres;
    }

    // artists
    if (updates.artists !== undefined) {

      if (!Array.isArray(updates.artists)) {
        throw { code: 400, message: 'El campo "artists" debe ser un arreglo.' };
      }

      updatedFields.artists = updates.artists;
    }

    // serviceCharge
    if (updates.serviceCharge !== undefined) {

      const value = Number(updates.serviceCharge);

      if (isNaN(value) || value < 0 || value > 100) {
        throw { code: 400, message: 'serviceCharge debe ser un número entre 0 y 100.' };
      }

      updatedFields.serviceCharge = value;
    }

    // campos simples
    [
      'state',
      'name',
      'description',
      'coverImage',
      'isGeneral',
      'template',
      'location'
    ].forEach(field => {
      if (updates[field] !== undefined) {
        updatedFields[field] = updates[field];
      }
    });

    await show.update(updatedFields);

    console.log(`Show actualizado exitosamente: ${show.name}`);
    console.log('Campos modificados:', Object.keys(updatedFields));

    return show;

  } catch (error) {

    console.error('Error al actualizar el show:', error.message || error);
    throw error;

  }
};