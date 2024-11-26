const getAllUsers = require('../../controllers/user/getAllUsers');

module.exports = async (req, res) => {

  try {
    const users = await getAllUsers();

    res.status(200).json(users);
    console.log('Users retrieved successfully')

  } catch (error) {
    
    res.status(400).json({
      error: error.message,
    });
  }
};
