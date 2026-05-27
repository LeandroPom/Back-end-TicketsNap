const { Router } = require('express');
const tagRouter = Router();
const createTag = require('../handlers/tag/createTagHandler');
const getAllTags = require('../handlers/tag/getAllTagsHandler');
const getTagById = require('../handlers/tag/getTagByIdHandler');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


//Public
tagRouter.get('/', getAllTags);
tagRouter.get('/:id', getTagById);

//Admin
tagRouter.post('/', auth, admin, createTag);

module.exports = tagRouter;