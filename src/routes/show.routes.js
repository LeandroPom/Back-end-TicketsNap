const { Router } = require('express');
const showRouter = Router();
const getAllShows = require('../handlers/show/getAllShowsHandler');
const createShow = require('../handlers/show/createShowHandler');
const getShowById = require('../handlers/show/getShowByIdHandler');
const editShow = require('../handlers/show/editShowHandler');
const disableShow = require('../handlers/show/disableShowHandler');
const deleteShow = require('../handlers/show/deleteShowhandler');


showRouter.get('/', getAllShows);
showRouter.get('/:id', getShowById);
showRouter.put('/edit', editShow);
showRouter.delete('/disable/:showId', disableShow);
showRouter.post('/', createShow);
showRouter.delete('/delete/:showId', deleteShow);

module.exports = showRouter;