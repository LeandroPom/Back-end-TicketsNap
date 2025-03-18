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


zoneRouter.post('/', createZone);
zoneRouter.get('/', getAllZones);
zoneRouter.get('/general', getGeneralZones);
zoneRouter.post('/add', addZone);
zoneRouter.post('/add/general', addGeneralZone);
zoneRouter.put('/edit', editZone);
zoneRouter.put('/edit/general', editGeneralZone);
zoneRouter.get('/filter', filterZone);

module.exports = zoneRouter;