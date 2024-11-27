const { Tag } = require('../../db');

module.exports = async () => {
  try {

    const tags = await Tag.findAll({
      attributes: ['id', 'name'], // Solo devuelve los campos relevantes
    });

    return tags;

  } catch (error) {
    
    console.error('Error fetching tags:', error.message);
    throw new Error('Failed to fetch tags.');
  }
};
