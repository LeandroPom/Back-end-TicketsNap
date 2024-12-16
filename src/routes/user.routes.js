const { Router } = require('express');
const userRouter = Router();
const getAllUsers = require('../handlers/user/getAllUsersHandler');
const createUser = require('../handlers/user/createUserHandler');
const getUserById = require('../handlers/user/getUserByIdHandler');
const editUser = require('../handlers/user/editUserHandler');
const paginate = require('../middlewares/paginate');


userRouter.get('/', getAllUsers, paginate); // Middleware de paginación aquí
userRouter.get('/:id', getUserById);
userRouter.put('/edit', editUser);
userRouter.post('/', createUser);

module.exports = userRouter;