// handlers/show/createShowHandler.js
const createShow = require('../../controllers/show/createShow');

module.exports = async (req, res) => {

    const { 
      name,
      artists,
      genre,
      location,
      presentation,
      description,
      coverImage
     } = req.body;
    
  try {

    const newShow = await createShow(
      name,
      artists,
      genre,
      location,
      presentation,
      description,
      coverImage
    );

    console.log('Show created successfully:', newShow);
    res.status(201).json(newShow);

  } catch (error) {

    console.error('Error creating show:', error.message);

    res.status(400).json({ message: error.message });
  }
};
