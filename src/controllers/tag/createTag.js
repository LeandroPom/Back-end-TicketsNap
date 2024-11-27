const { Tag } = require('../../db');

module.exports = async (name) => {
  // Validar el campo obligatorio
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Name is required and must be a non-empty string.');
  }

  // Normalizar el formato del nombre (capitalizar solo la primera letra)
  const normalizedTagName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  // Comprobar duplicados
  const existingTag = await Tag.findOne({ where: { name: normalizedTagName } });
  if (existingTag) {
    throw new Error('Tag with this name already exists.');
  }

  // Crear el nuevo Tag
  const newTag = await Tag.create({ name: normalizedTagName });

  return newTag.dataValues;
};
