const { Router } = require('express');
const placeRouter = Router();
const getAllPlaces = require('../handlers/place/getAllPlacesHandler');
const createPlace = require('../handlers/place/createPlaceHandler');
const getPlaceByName = require('../handlers/place/getPlaceByNameHandler');
// const getPlaceById = require('../handlers/place/getPlaceByIdHandler');


placeRouter.get('/', getAllPlaces);
// placeRouter.get('/places/:id', getPlaceById);
placeRouter.get('/:name', getPlaceByName);
placeRouter.post('/', createPlace);

module.exports = placeRouter;