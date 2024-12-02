const { Router } = require('express');
const placeRouter = Router();
const getAllPlaces = require('../handlers/place/getAllPlacesHandler');
const createPlace = require('../handlers/place/createPlaceHandler');
// const getPlaceById = require('../handlers/place/getPlaceByIdHandler');


placeRouter.get('/', getAllPlaces);
// placeRouter.get('/places/:id', getPlaceById);
placeRouter.post('/', createPlace);

module.exports = placeRouter;