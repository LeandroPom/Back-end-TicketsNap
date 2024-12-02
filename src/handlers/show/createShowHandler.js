// handlers/show/createShowHandler.js
const createShow = require('../../controllers/show/createShow');

module.exports = async (req, res) => {
  const { name, artists, genre, locationName, presentation, description, coverImage, price } = req.body;

  try {
    const newShow = await createShow(
      name,
      artists,
      genre,
      locationName,
      presentation,
      description,
      coverImage,
      price
    );

    console.log('Show created successfully:', newShow);
    res.status(201).json(newShow);

  } catch (error) {
    console.error('Error creating show:', error.message);

    // Devolver el código de error específico si está disponible
    const statusCode = error.code || 500;
    res.status(statusCode).json({ message: error.message });
  }
};
