const { Router } = require('express');
const zoneRouter = Router();
const getAllZones = require('../handlers/zone/getAllZonesHandler');
const createZone = require('../handlers/zone/createZoneHandler');
const editZone = require('../handlers/zone/editZoneHandler');
const addZone = require('../handlers/zone/addZoneHandler');
const filterZone = require('../handlers/zone/filterZoneHandler');


zoneRouter.get('/', getAllZones);
zoneRouter.post('/', createZone);
zoneRouter.put('/edit', editZone);
zoneRouter.post('/add', addZone);
zoneRouter.get('/filter', filterZone);

module.exports = zoneRouter;