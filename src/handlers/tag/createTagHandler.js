const createTag = require('../../controllers/tag/createTag');

const createTagHandler = async (req, res) => {
  const { name } = req.body;

  try {

    const newTag = await createTag(name);

    console.log('Tag created successfully:', newTag);
    res.status(201).json(newTag);

  } catch (error) {

    console.error('Error creating Tag:', error.message);
    res.status(400).json({ error: error.message });
  }

};

module.exports = createTagHandler;
