const { Router } = require('express');
const placeRouter = Router();
const getAllPlaces = require('../handlers/place/getAllPlacesHandler');
const createPlace = require('../handlers/place/createPlaceHandler');
const getPlaceByName = require('../handlers/place/getPlaceByNameHandler');
const deletePlace = require('../handlers/place/deletePlaceHandler');


placeRouter.get('/', getAllPlaces);
placeRouter.post('/', createPlace);
placeRouter.get('/:name', getPlaceByName);
placeRouter.delete('/:id', deletePlace);

module.exports = placeRouter;