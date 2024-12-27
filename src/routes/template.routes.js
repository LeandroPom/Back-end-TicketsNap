const { Router } = require('express');
const templateRouter = Router();
const loadTemplates = require('../Templates/loadTemplates');



templateRouter.post('/:name', loadTemplates);



module.exports = templateRouter;