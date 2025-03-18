const getAllShows = require('../../controllers/show/getAllShows');

const getAllShowsHandler = async (req, res) => {
  try {

    const shows = await getAllShows();
    
    console.log('Shows fetched successfully:', shows);
    res.status(200).json(shows);

  } catch (error) {

    console.error('Error fetching shows:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAllShowsHandler;
