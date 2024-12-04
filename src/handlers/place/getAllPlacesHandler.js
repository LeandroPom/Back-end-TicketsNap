// handlers/place/getAllPlacesHandler.js
const getAllPlaces = require('../../controllers/place/getAllPlaces');

module.exports = async (req, res) => {
  try {
    // Llamar al controlador para obtener todos los registros de Place
    const places = await getAllPlaces();

    console.log('Places retrieved successfully:');

    res.status(200).json(places); // Responder con todos los registros
  } catch (error) {
    console.error('Error retrieving places:', error.message);

    res.status(500).json({ message: 'Error retrieving places', error: error.message });
  }
};
