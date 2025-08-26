// const deleteTicket = require('../../controllers/ticket/deleteTicket')
// const bulkDeleteTicket = require('../../controllers/ticket/bulkDeleteTicket')
const { Ticket } = require('../../db');

module.exports = async (req, res) => {
  try {

    const paymentData = req.query || req.body; // Datos recibidos de Mercado Pago
  
    if (!paymentData.payment_id || !paymentData.external_reference) {
      console.error("⚠️ Advertencia: Datos de pago incompletos.");
      return res.status(400).json({ error: "Datos de pago incompletos." });
    }

    // Guardar los datos en una variable temporal
    const failurePaymentInfo = {
      status: "failure",
      payment_id: paymentData.payment_id,
      external_reference: paymentData.external_reference,
      status_detail: paymentData.status_detail,
    };
    
    console.log("❌ Pago fallido:", failurePaymentInfo);

    const regex = /ticketId:\s*([\d,]+),\s*zoneId:\s*(\d+),\s*showId:\s*(\d+),\s*mail:\s*([\w.@]+)/;
    const match = failurePaymentInfo.external_reference.match(regex);
    
    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }
    
    const ticketIds = match[1].split(",").map(id => parseInt(id.trim(), 10));
    const ticketArray= ticketIds.map(id => ({ ticketId: id }));

    // 6️⃣ Eliminar tickets
    for (const { ticketId } of ticketArray) {
      if (!ticketId) throw new Error("ticketId es obligatorio.");

      await Ticket.destroy({ where: { id: ticketId } });

      console.log(`🗑️ Ticket con ID ${ticketId} eliminado correctamente.`);
    }

    return res.redirect(302, `${process.env.FRONTEND_URL}/failure`);
  
  } catch (error) {
    console.error("❌ Error en failurePayment:", error);
    res.status(500).json({ error: "Error interno al procesar el pago fallido." });
  }
};
  