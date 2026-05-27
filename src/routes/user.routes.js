const { Router } = require('express');
const userRouter = Router();

const getAllUsers = require('../handlers/user/getAllUsersHandler');
const createUser = require('../handlers/user/createUserHandler');
const getUserById = require('../handlers/user/getUserByIdHandler');
const editUser = require('../handlers/user/editUserHandler');

const assignEvent = require('../handlers/user/assignEventHandler');
const getAssignedEvents = require('../handlers/user/getAssignedEventsHandler');

const login = require('../controllers/user/login');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


/**
 * ============================================================
 * PUBLIC ROUTES
 * ============================================================
 */

userRouter.post('/', createUser);
userRouter.get('/', getAllUsers);
userRouter.post('/login', login);


/**
 * ============================================================
 * USER ROUTES (requieren autenticaciÃ³n)
 * ============================================================
 */

userRouter.put('/edit', auth, editUser);

/**
 * Obtener eventos asignados al usuario
 * Permite consultar a cashiers o admins
 */
userRouter.post('/assigned', auth, getAssignedEvents);


/**
 * ============================================================
 * ADMIN ROUTES
 * ============================================================
 */

/**
 * Obtener usuario por ID
 */
userRouter.get('/:id', auth, admin, getUserById);

/**
 * Asignar eventos a un cashier
 */
userRouter.post('/assign', auth, admin, assignEvent);


module.exports = userRouter;