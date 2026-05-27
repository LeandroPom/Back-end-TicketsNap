const { Router } = require('express');
const bannerRouter = Router();
const getAllBanners = require('../handlers/banner/getAllBannersHandler');
const createBanner = require('../handlers/banner/createBannerHandler');
const deleteBanner = require('../handlers/banner/deleteBannerHandler');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


//Public
bannerRouter.get('/', getAllBanners);

//Admin
bannerRouter.post('/', auth, admin, createBanner);
bannerRouter.delete('/:name/:static', auth, admin, deleteBanner);

module.exports = bannerRouter;