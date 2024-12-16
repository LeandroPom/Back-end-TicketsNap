const getAllUsers = require('../../controllers/user/getAllUsers');
const paginate = require('../../middlewares/paginate');

module.exports = async (req, res, next) => {

  try {
    const users = await getAllUsers();

    // res.status(200).json(users);
    // console.log('Users retrieved successfully')

    // Pasar los usuarios a res.locals.data para el middleware de paginación
    res.locals.data = users;

    // Continuar con el middleware de paginación
    next();

  } catch (error) {
    
    res.status(400).json({
      error: error.message,
    });
  }
};
