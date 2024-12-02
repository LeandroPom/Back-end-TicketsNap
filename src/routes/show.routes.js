const { Router } = require('express');
const showRouter = Router();
const getAllShows = require('../handlers/show/getAllShowsHandler');
const createShow = require('../handlers/show/createShowHandler');
const getShowById = require('../handlers/show/getShowByIdHandler');


showRouter.get('/', getAllShows);
showRouter.get('/shows/:id', getShowById);
showRouter.post('/', createShow);

module.exports = showRouter;