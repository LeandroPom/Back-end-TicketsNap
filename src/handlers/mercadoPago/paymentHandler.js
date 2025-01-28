const payment = require('../../controllers/mercadoPago/payment');

module.exports = async (req, res) => {
  try {
    const { ticketId, name, email, phone, dni, price, description, payment_method_id } = req.body;

    // Validar datos obligatorios
    if (!ticketId || !name || !email || !price || !description || !payment_method_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios para procesar el pago." });
    }

    // Llamar al controlador de creación de pago
    const paymentResponse = await payment(ticketId, name, email, phone, dni, price, description, payment_method_id);

    res.status(200).json(paymentResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
