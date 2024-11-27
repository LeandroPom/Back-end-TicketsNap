const { Router } = require('express');
const tagRouter = Router();
const getAllTags = require('../handlers/tag/getAllTagsHandler');
const createTag = require('../handlers/tag/createTagHandler');


tagRouter.get('/', getAllTags);
tagRouter.post('/', createTag);

module.exports = tagRouter;