const getAllBanners = require('../../controllers/banner/getAllBanners');

const getAllBannersHandler = async (req, res) => {
  try {

    const banners = await getAllBanners();
    
    console.log('Banners fetched successfully:', banners);
    res.status(200).json(banners);

  } catch (error) {
    
    console.error('Error fetching banners:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAllBannersHandler;
