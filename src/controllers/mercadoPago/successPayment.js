const activateTicket = require('../../controllers/ticket/activateTicket')

module.exports = async (req, res) => {
  try {
    const paymentData = req.query || req.body; // Datos recibidos de Mercado Pago

    if (!paymentData.payment_id || !paymentData.external_reference) {
      console.error("Error: Datos de pago incompletos.");
      return res.status(400).json({ error: "Datos de pago incompletos." });
    }

    // Guardar los datos en una variable temporal
    const successPaymentInfo = {
      status: "success",
      payment_id: paymentData.payment_id,
      external_reference: paymentData.external_reference,
      status_detail: paymentData.status_detail,
    };

    console.log("✅ Pago exitoso:", successPaymentInfo);

    const ticket = await activateTicket(paymentData.external_reference)

    // res.status(200).json({
    //   message: "Pago exitoso registrado correctamente.",
    //   paymentData: successPaymentInfo,
    //   ticket: ticket
    // });

    // Redirigir a la página principal tras procesar el pago exitoso
    return res.redirect(302, "http://localhost:3001");

  } catch (error) {
    console.error("❌ Error en successPayment:", error);
    res.status(500).json({ error: "Error interno al procesar el pago exitoso." });
  }
};
