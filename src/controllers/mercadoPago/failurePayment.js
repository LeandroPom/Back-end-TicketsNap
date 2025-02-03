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
  
      res.status(200).json({
        message: "Pago fallido registrado correctamente.",
        paymentData: failurePaymentInfo,
      });
  
    } catch (error) {
      console.error("❌ Error en failurePayment:", error);
      res.status(500).json({ error: "Error interno al procesar el pago fallido." });
    }
  };
  