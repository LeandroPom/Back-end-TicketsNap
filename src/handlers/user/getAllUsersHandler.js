const getAllUsers = require('../../controllers/user/getAllUsers');

module.exports = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
