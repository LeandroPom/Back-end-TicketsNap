const deletePlace = require('../../controllers/place/deletePlace');

module.exports = async (req, res) => {
  
  const { id } = req.params;

  try {

    if (!/^\d+$/.test(id)) throw new Error('Invalid ID format');

    const place = await deletePlace(id);

    return res.status(200).json(place);

  } catch (error) {

    return res.status(404).json({ error: error.message });
  }
};
