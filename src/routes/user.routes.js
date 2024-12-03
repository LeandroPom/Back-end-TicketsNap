const { Router } = require('express');
const userRouter = Router();
const getAllUsers = require('../handlers/user/getAllUsersHandler');
const createUser = require('../handlers/user/createUserHandler');
const getUserById = require('../handlers/user/getUserByIdHandler');


userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);

module.exports = userRouter;