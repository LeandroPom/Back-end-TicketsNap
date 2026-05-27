const { Router } = require('express');
const showRouter = Router();
const getAllShows = require('../handlers/show/getAllShowsHandler');
const createShow = require('../handlers/show/createShowHandler');
const getShowById = require('../handlers/show/getShowByIdHandler');
const editShow = require('../handlers/show/editShowHandler');
const disableShow = require('../handlers/show/disableShowHandler');
const deleteShow = require('../handlers/show/deleteShowhandler');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

//Public
showRouter.get('/', getAllShows);
showRouter.get('/:id', getShowById);

//Admin
showRouter.post('/', auth, admin, createShow);
showRouter.put('/edit', auth, admin, editShow);
showRouter.delete('/delete/:showId', auth, admin, deleteShow);
showRouter.delete('/disable/:showId', auth, admin, disableShow);

module.exports = showRouter;