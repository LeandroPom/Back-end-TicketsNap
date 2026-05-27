const { Router } = require('express');
const zoneRouter = Router();
const createZone = require('../handlers/zone/createZoneHandler');
const getAllZones = require('../handlers/zone/getAllZonesHandler');
const getGeneralZones = require('../handlers/generalZone/getGeneralZonesHandler');
const addZone = require('../handlers/zone/addZoneHandler');
const addGeneralZone = require('../handlers/generalZone/addGeneralZoneHandler');
const editZone = require('../handlers/zone/editZoneHandler');
const editGeneralZone = require('../handlers/generalZone/editGeneralZoneHandler');
const filterZone = require('../handlers/zone/filterZoneHandler');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

//Public
zoneRouter.get('/', getAllZones);
zoneRouter.get('/general', getGeneralZones);
zoneRouter.get('/filter', filterZone);

//Admin
zoneRouter.post('/', auth, admin, createZone);
zoneRouter.post('/add', auth, admin, addZone);
zoneRouter.put('/edit', auth, admin, editZone);
zoneRouter.post('/add/general', auth, admin, addGeneralZone);
zoneRouter.put('/edit/general', auth, admin, editGeneralZone);

module.exports = zoneRouter;