// handlers/place/createPlaceHandler.js
const createPlace = require('../../controllers/place/createPlace');

module.exports = async (req, res) => {

  const { name, address, capacity } = req.body;

  try {

    const newPlace = await createPlace(name, address, capacity);

    console.log('Place created successfully:', newPlace);
    res.status(201).json(newPlace);

  } catch (error) {
    
    console.error('Error creating place:', error.message);

    // Usar código de error si está definido, o 500 por defecto
    const statusCode = error.code || 500;
    res.status(statusCode).json({ message: error.message });
  }
};
