const { Router } = require('express');
const userRouter = Router();
// const getAllUsers = require('../handlers/handlerUsers/handlerGetAllUsers');
const createUser = require('../handlers/handlerUsers/handlerCreateUser');


// userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);

module.exports = userRouter;