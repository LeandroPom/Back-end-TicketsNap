const getShowById = require('../../controllers/show/getShowById');

module.exports = async (req, res) => {

  const { id } = req.params;

  try {

    const show = await getShowById(id);

    return res.status(200).json(show);

  } catch (error) {

    return res.status(404).json({ error: error.message });
  }
};
