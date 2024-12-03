const { Show } = require('../../db');

module.exports = async () => {

  try {

    const shows = await Show.findAll(
    //   {
    //   attributes: [
    //     'id',
    //     'name',
    //     'artists',
    //     'genre',
    //     'location',
    //     'presentation',
    //     'description',
    //     'coverImage',
    //     'state',
    //   ], // Devuelve solo los campos relevantes
    // }
  );

    return shows;

  } catch (error) {
    
    console.error('Error fetching shows:', error.message);
    throw new Error('Failed to fetch shows.');
  }
};
