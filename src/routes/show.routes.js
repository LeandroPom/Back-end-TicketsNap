const { Router } = require('express');
const showRouter = Router();
const getAllShows = require('../handlers/show/getAllShowsHandler');
const createShow = require('../handlers/show/createShowHandler');


showRouter.get('/', getAllShows);
showRouter.post('/', createShow);

module.exports = showRouter;