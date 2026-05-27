const createBanner = require('../../controllers/banner/createBanner');

const createBannerHandler = async (req, res) => {

  const { name, url, static } = req.body;

  try {

    console.log('BODY RECIBIDO:', req.body);

    // VALIDACIÓN CORRECTA
    if (
      !name ||
      !url ||
      typeof static !== 'boolean'
    ) {
      throw new Error(
        "Los parámetros 'name', 'url' y 'static' son obligatorios."
      );
    }

    const newBanner = await createBanner(
      name,
      url,
      static
    );

    console.log(
      '✅ Banner created successfully:',
      newBanner
    );

    res.status(201).json(newBanner);

  } catch (error) {

    console.error(
      '❌ Error creating Banner:',
      error.message
    );

    res.status(400).json({
      error: error.message
    });
  }

};

module.exports = createBannerHandler;