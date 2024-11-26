const { Router } = require('express');
const userRouter = Router();
const getAllUsers = require('../handlers/user/getAllUsersHandler');
const createUser = require('../handlers/user/createUserHandler');


userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);

module.exports = userRouter;