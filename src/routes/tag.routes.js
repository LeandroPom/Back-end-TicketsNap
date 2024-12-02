const { Router } = require('express');
const tagRouter = Router();
const getAllTags = require('../handlers/tag/getAllTagsHandler');
const createTag = require('../handlers/tag/createTagHandler');
const getTagById = require('../handlers/tag/getTagByIdHandler');


tagRouter.get('/', getAllTags);
tagRouter.get('/tags/:id', getTagById);
tagRouter.post('/', createTag);

module.exports = tagRouter;