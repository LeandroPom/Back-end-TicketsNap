const getAllPlaces = require('../controllers/place/getAllPlaces');
const getAllShows = require('../controllers/show/getAllShows');
const getAllUsers = require('../controllers/user/getAllUsers');
const getAllZones = require('../controllers/zone/getAllZones');

module.exports = async (req, res) => {

      // Validar permisos de administrador**
  // if (!req.body.user?.isAdmin) {
  //   return res.status(403).json({
  //     error: 'No tienes permisos para realizar esta acción.',
  //   });
  // }

  try {
    // Llamar al controlador para obtener todos datos

    const places = await getAllPlaces();
    const shows = await getAllShows();
    const users = await getAllUsers();
    const zones = await getAllZones();


    res.status(200).json({users, shows, places, zones}); // Responder con todos los registros
  } catch (error) {
    console.error('Error retrieving data:', error.message);

    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
};
