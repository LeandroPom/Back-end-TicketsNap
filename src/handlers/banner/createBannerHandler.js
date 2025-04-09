const createBanner = require('../../controllers/banner/createBanner');

const createBannerHandler = async (req, res) => {

  const { name, url } = req.body;

  try {

    if (!name || !url) {
        throw new Error("Los parámetros 'name' y 'url' son obligatorios.");
    }

    const newBanner = await createBanner(name, url);

    console.log('Banner created successfully:', newBanner);
    res.status(201).json(newBanner);

  } catch (error) {

    console.error('Error creating Banner:', error.message);
    res.status(400).json({ error: error.message });
  }

};

module.exports = createBannerHandler;
