const { Router } = require('express');
const bannerRouter = Router();
const getAllBanners = require('../handlers/banner/getAllBannersHandler');
const createBanner = require('../handlers/banner/createBannerHandler');
const deleteBanner = require('../handlers/banner/deleteBannerHandler');


bannerRouter.get('/', getAllBanners);
bannerRouter.post('/', createBanner);
bannerRouter.delete('/:name', deleteBanner);

module.exports = bannerRouter;