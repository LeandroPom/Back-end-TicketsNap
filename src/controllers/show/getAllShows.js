const { Show } = require('../../db');

module.exports = async () => {

  try {

    const shows = await Show.findAll();

    return shows;

  } catch (error) {
    
    console.error('Error fetching shows:', error.message);
    throw new Error('Failed to fetch shows.');
  }
};
