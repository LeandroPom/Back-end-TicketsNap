const { Router } = require('express');
const userRouter = Router();
const getAllUsers = require('../handlers/user/getAllUsersHandler');
const createUser = require('../handlers/user/createUserHandler');
const getUserById = require('../handlers/user/getUserByIdHandler');
const editUser = require('../handlers/user/editUserHandler');
const paginate = require('../middlewares/paginate');
const login = require('../controllers/user/login');


userRouter.get('/', getAllUsers); // Middleware de paginación aquí
userRouter.get('/:id', getUserById);
userRouter.put('/edit', editUser);
userRouter.post('/login', login);
userRouter.post('/', createUser);

module.exports = userRouter;