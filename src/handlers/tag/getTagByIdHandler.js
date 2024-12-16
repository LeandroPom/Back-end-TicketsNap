const getTagById = require('../../controllers/tag/getTagById');

module.exports = async (req, res) => {
  
  const { id } = req.params;

  try {

    const tag = await getTagById(id);

    return res.status(200).json(tag);

  } catch (error) {

    return res.status(404).json({ error: error.message });
  }
};
