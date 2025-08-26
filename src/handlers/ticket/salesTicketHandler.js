const salesTicket = require('../../controllers/ticket/salesTicket');

module.exports = async (req, res) => {
  try {
    const { tickets, service } = req.body;

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "Se requiere un array de tickets para procesar la compra." });
    }

    // Validación mínima por ticket
    for (const ticket of tickets) {
      const { showId, zoneId, division, price, name, mail } = ticket;
      if (!showId || !zoneId || !division || !price || !name || !mail) {
        return res.status(400).json({ error: "Faltan datos obligatorios en uno o más tickets." });
      }
    }

    const result = await salesTicket(tickets, service);
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
