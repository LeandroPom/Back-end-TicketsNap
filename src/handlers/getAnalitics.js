const getAllShows = require('../controllers/show/getAllShows');
const getAllUsers = require('../controllers/user/getAllUsers');
const getAllZones = require('../controllers/zone/getAllZones');
const getAllTickets = require('../controllers/ticket/getAllTickets'

);

module.exports = async (req, res) => {

  try {
    // Llamar al controlador para obtener todos datos

    // const places = await getAllPlaces();
    const shows = await getAllShows();
    const users = await getAllUsers();
    const zones = await getAllZones();
    const tickets = await getAllTickets();


    res.status(200).json({users, shows, tickets, zones}); // Responder con todos los registros
  } catch (error) {
    console.error('Error retrieving data:', error.message);

    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
};
