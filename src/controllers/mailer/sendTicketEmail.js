// sendTicketsEmail.js
require("dotenv").config();
const transporter = require("./nodemailerConfig");
const generateTicketsPDF = require("./generateTicketPDF");
const fs = require("fs");

module.exports = async (ticketsData = []) => {
  let pdfPath;

  try {
    if (!ticketsData.length) {
      throw new Error("No se proporcionaron tickets para enviar.");
    }

    console.log("📩 Tickets recibidos:", ticketsData.map(t => ({
      showId: t.showId,
      id: t.id,
      name: t.name,
      mail: t.mail
    })));

    pdfPath = await generateTicketsPDF(ticketsData);

    const destinatario = ticketsData[0].mail;
    const nombre = ticketsData[0].name;

    const mailOptions = {
      from: `"🎟️ SOLTICKET" <${process.env.MAIL_USER}>`,
      to: destinatario,
      subject: "🎟️ Confirmación de Compra - Tickets Adjuntos",
      text: `Hola ${nombre},\n\nTu compra se ha realizado con éxito.\nAdjunto encontrarás tus tickets.\n\n¡Disfruta del evento!`,
      attachments: [
        {
          filename: `Tickets_${nombre}.pdf`,
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    
    return { success: true, message: "Correo enviado con éxito." };

  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);

    return {
      success: false,
      message: "No se pudo enviar el correo, pero el flujo continúa."
    };

  } finally {
    // 🧹 borrar PDF actual
    if (pdfPath) {
      try {
        fs.unlinkSync(pdfPath);
        
      } catch (err) {
        console.warn(`⚠️ No se pudo eliminar PDF actual:`, err);
      }
    }

    // 🧹 limpiar PDFs viejos temp_tickets_
    try {
      const projectRoot = process.cwd(); // 🔥 CLAVE DEL FIX
      const files = fs.readdirSync(projectRoot);
      const now = Date.now();

     

      files.forEach(file => {
        if (!file.startsWith("temp_tickets_")) {
          return;
        }

        const filePath = `${projectRoot}/${file}`;

        try {
          const stats = fs.statSync(filePath);

          const age = now - stats.birthtimeMs;

        
          // 🔥 5 segundos (test)
          if (age > 5000) {
            fs.unlinkSync(filePath);
            console.log("🗑️ ELIMINADO:", file);
          } else {
            console.log("🟡 NO BORRADO (muy reciente):", file);
          }

        } catch (err) {
          console.log("❌ Error procesando archivo:", file);
          console.error(err);
        }
      });

    } catch (err) {
      console.warn("⚠️ No se pudo limpiar temp tickets:", err);
    }
  }
};
