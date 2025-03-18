module.exports = async (req, res) => {
    try {
      const notificationData = req.query || req.body; // Datos recibidos de Mercado Pago
  
      if (!notificationData || Object.keys(notificationData).length === 0) {
        console.error("⚠️ Advertencia: No se recibieron datos en la notificación.");
        return res.status(400).json({ error: "No se recibieron datos en la notificación." });
      }
  
      // Almacenar los datos en una variable temporal
      const paymentNotification = {
        action: notificationData.action || "unknown",
        id: notificationData.id || "unknown",
        type: notificationData.type || "unknown",
        live_mode: notificationData.live_mode || false,
        date_created: notificationData.date_created || "unknown",
        external_reference: notificationData.external_reference || "unknown",
      };
  
      console.log("📩 Notificación de pago recibida:", paymentNotification);
  
      res.status(200).json({
        message: "Notificación de pago recibida correctamente.",
        notificationData: paymentNotification,
      });
  
    } catch (error) {
      console.error("❌ Error en notificationPayment:", error);
      res.status(500).json({ error: "Error interno al procesar la notificación de pago." });
    }
  };
  