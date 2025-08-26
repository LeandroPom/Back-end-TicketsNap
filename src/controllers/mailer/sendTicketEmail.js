// sendTicketsEmail.js
require("dotenv").config();
const transporter = require("./nodemailerConfig");
const generateTicketsPDF = require("./generateTicketPDF"); // 👈 importante: usar la nueva función
const fs = require("fs");

module.exports = async (ticketsData = []) => {
  try {
    if (!ticketsData.length) {
      throw new Error("No se proporcionaron tickets para enviar.");
    }

    // 📌 Log para ver qué datos llegan
    console.log("📩 Tickets recibidos en sendTicketsEmail:", ticketsData.map(t => ({
      showId: t.showId,
      id: t.id,
      name: t.name,
      mail: t.mail
    })));

    // ✅ Generar un único PDF con todos los tickets
    const pdfPath = await generateTicketsPDF(ticketsData);

    const destinatario = ticketsData[0].mail; // asumimos que todos van al mismo mail
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

    // 📤 Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado a: ${destinatario} con ${ticketsData.length} tickets en 1 PDF`);

    // 🗑️ Eliminar PDF temporal
    try {
      fs.unlinkSync(pdfPath);
      console.log(`🗑️ PDF temporal eliminado: ${pdfPath}`);
    } catch (err) {
      console.warn(`⚠️ No se pudo eliminar ${pdfPath}:`, err);
    }

    return { success: true, message: "Correo enviado con éxito." };
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo.");
  }
};