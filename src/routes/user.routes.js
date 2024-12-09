const { Router } = require('express');
const userRouter = Router();
const getAllUsers = require('../handlers/user/getAllUsersHandler');
const createUser = require('../handlers/user/createUserHandler');
const getUserById = require('../handlers/user/getUserByIdHandler');
const editUser = require('../handlers/user/editUserHandler');


userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.put('/edit', editUser);
userRouter.post('/', createUser);

module.exports = userRouter;