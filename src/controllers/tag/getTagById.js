const { Tag } = require('../../db');

module.exports = async (id) => {

  if (!/^\d+$/.test(id)) throw new Error('Invalid ID format');

  const tag = await Tag.findByPk(id);

  if (!tag) throw new Error(`Tag with ID ${id} not found`);

  return tag;
};
