const { Router } = require('express');
const placeRouter = Router();
const getAllPlaces = require('../handlers/place/getAllPlacesHandler');
const createPlace = require('../handlers/place/createPlaceHandler');
const getPlaceByName = require('../handlers/place/getPlaceByNameHandler');
const deletePlace = require('../handlers/place/deletePlaceHandler');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

//Public
placeRouter.get('/', getAllPlaces);
placeRouter.get('/:name', getPlaceByName);

//Admin
placeRouter.post('/', auth, admin, createPlace);
placeRouter.delete('/:id', auth, admin, deletePlace);

module.exports = placeRouter;