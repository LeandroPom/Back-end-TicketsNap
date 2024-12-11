const { Router } = require('express');
const showRouter = Router();
const getAllShows = require('../handlers/show/getAllShowsHandler');
const createShow = require('../handlers/show/createShowHandler');
const getShowById = require('../handlers/show/getShowByIdHandler');
const editShow = require('../handlers/show/editShowHandler');


showRouter.get('/', getAllShows);
showRouter.get('/:id', getShowById);
showRouter.put("/edit/:id", editShow);
showRouter.post('/', createShow);

module.exports = showRouter;