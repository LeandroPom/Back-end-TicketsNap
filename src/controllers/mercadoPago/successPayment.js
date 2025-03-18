require("dotenv").config(); 
const { Zone, Ticket } = require('../../db');
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
    const ticketId = Number(match[1]);
    
    // **Paso 3: Validar ticket**
    const ticket = await Ticket.findByPk(ticketId);
    
    console.log("✅ Pago exitoso:", successPaymentInfo);
    
    // Redirigir a la página principal tras procesar el pago exitoso
    if (ticket.dataValues.row || ticket.dataValues.division === "Tribunas Generales") {
      const seatTicket = await activateTicket(paymentData.external_reference)

      console.log("activate-ticket")
      
      return res.redirect(302, `${process.env.FRONTEND_URL}/success/${ticket.dataValues.id}`);
      
    } else {
      
      const generalTicket = await activateGeneralTicket(paymentData.external_reference)
      
      console.log("activate-general-ticket")

      return res.redirect(302, `${process.env.FRONTEND_URL}/general/ticket/success/${ticket.dataValues.id}`);
    }

  } catch (error) {
    console.error("❌ Error en successPayment:", error);
    res.status(500).json({ error: "Error interno al procesar el pago exitoso." });
  }
};
