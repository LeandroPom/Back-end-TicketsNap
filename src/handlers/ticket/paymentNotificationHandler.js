const paymentNotification = require('../../controllers/ticket/paymentNotification');

module.exports = async (req, res) => {
  try {
    // Mercado Pago envía la notificación en el cuerpo de la solicitud
    const paymentData = req.body;

    // Procesar la notificación
    await paymentNotification(paymentData);

    res.status(200).send('Notificación recibida y procesada correctamente.');
  } catch (error) {
    console.error(`Error en paymentNotificationHandler: ${error.message}`);
    res.status(500).send(`Error al procesar la notificación: ${error.message}`);
  }
};
