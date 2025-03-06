const buyTicket = require('../../controllers/ticket/buyGeneralTicket');

module.exports = async (req, res) => {
  try {
    const { showId, zoneId, division, price, name, dni, mail, phone, userId } = req.body;

    // Validar datos obligatorios
    if (!showId || !zoneId || !division || !price || !name || !mail) {
      return res.status(400).json({ error: "Faltan datos obligatorios para procesar el pago." });
    }

    // Llamar al controlador de compra (ya adaptado a GeneralZone)
    const paymentResponse = await buyTicket(showId, zoneId, division, price, name, dni, mail, phone, userId);

    res.status(200).json(paymentResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
