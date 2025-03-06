const filterZone = require('../../controllers/zone/filterZone');

module.exports = async (req, res) => {

    try {
      const { zoneId, division, row, seatId } = req.body;

      const result = await filterZone(zoneId, division, row, seatId);

      return res.json(result);

    } catch (error) {

      console.error(error);

      return res.status(400).json({ error: error.message });
    }
};
  
