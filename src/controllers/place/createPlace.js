// controllers/place/createPlace.js
const { Place } = require('../../db');

module.exports = async (name, address) => {
  // Validar campos obligatorios
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw { code: 400, message: 'Name is required and must be a valid string' };
  }
  if (!address || typeof address !== 'string' || address.trim() === '') {
    throw { code: 400, message: 'Address is required and must be a valid string' };
  }

  // Normalizar datos
  const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  const normalizedAddress = address.trim().charAt(0).toUpperCase() + address.trim().slice(1);

  // Verificar duplicados
  const existingPlace = await Place.findOne({
    where: { name: normalizedName, address: normalizedAddress },
  });
  if (existingPlace) {
    throw { code: 409, message: 'A place with the same name and address already exists' };
  }

  // Crear lugar
  const newPlace = await Place.create({
    name: normalizedName,
    address: normalizedAddress,
  });

  // Devolver los datos creados
  return newPlace.dataValues;
};
