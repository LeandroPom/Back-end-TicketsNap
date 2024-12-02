const getUserById = require('../../controllers/user/getUserById');

module.exports = async (req, res) => {

  const { id } = req.params;

  try {

    const user = await getUserById(id);

    return res.status(200).json(user);

  } catch (error) {

    return res.status(404).json({ error: error.message });
  }
};