const { Router } = require('express');
const analiticsRouter = Router();
const getAnalitics = require('../handlers/getAnalitics');



analiticsRouter.get('/', getAnalitics);
module.exports = analiticsRouter;