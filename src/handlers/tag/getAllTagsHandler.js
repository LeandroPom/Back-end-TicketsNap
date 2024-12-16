const getAllTags = require('../../controllers/tag/getAllTags');

const getAllTagsHandler = async (req, res) => {
  try {

    const tags = await getAllTags();
    console.log('Tags fetched successfully:', tags)
    ;
    res.status(200).json(tags);

  } catch (error) {
    
    console.error('Error fetching tags:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAllTagsHandler;
