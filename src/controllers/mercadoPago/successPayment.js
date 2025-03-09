const { Zone } = require('../../db');
const activateTicket = require('../../controllers/ticket/activateTicket');
const activateGeneralTicket = require('../../controllers/ticket/activateGeneralTicket');

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

    // **Paso 1: Extraer ticketId, zoneId y mail desde externalReference**
    const regex = /ticketId:\s*(\d+),\s*zoneId:\s*(\d+),\s*showId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = paymentData.external_reference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const zoneId = Number(match[2]);

    // **Paso 3: Validar Zona**
    const zone = await Zone.findByPk(zoneId);

    console.log("✅ Pago exitoso:", successPaymentInfo);

    if (zone) {
      const ticket = await activateTicket(paymentData.external_reference)

      return res.redirect(302, "http://localhost:3000/success");
    }
    
    if (!zone) {
      const generalTicket = await activateGeneralTicket(paymentData.external_reference)
      
      return res.redirect(302, "http://localhost:3000/general/ticket/success");
    }  

    // res.status(200).json({
    //   message: "Pago exitoso registrado correctamente.",
    //   paymentData: successPaymentInfo,
    //   ticket: ticket
    // });

    // Redirigir a la página principal tras procesar el pago exitoso
 

  } catch (error) {
    console.error("❌ Error en successPayment:", error);
    res.status(500).json({ error: "Error interno al procesar el pago exitoso." });
  }
};
