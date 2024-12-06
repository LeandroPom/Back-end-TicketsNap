const { Router } = require('express');
const zoneRouter = Router();
const getAllZones = require('../handlers/zone/getAllZonesHandler');
const createZone = require('../handlers/zone/createZoneHandler');
const editZone = require('../handlers/zone/editZoneHandler');
// const getZoneById = require('../handlers/zone/getZoneByIdHandler');


zoneRouter.get('/', getAllZones);
// zoneRouter.get('/:id', getZoneById);
zoneRouter.post('/', createZone);
zoneRouter.put('/edit', editZone);

module.exports = zoneRouter;