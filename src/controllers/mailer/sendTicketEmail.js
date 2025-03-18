require("dotenv").config();
const transporter = require("./nodemailerConfig");
const generateTicketPDF = require("./generateTicketPDF");
const fs = require("fs");

module.exports = async (ticketData) => {
  try {
    // **Generar el PDF del ticket**
    const pdfPath = await generateTicketPDF(ticketData);

    // **Configurar el correo**
    const mailOptions = {
      from: `"🎟️ SOLTICKET" <${process.env.MAIL_USER}>`,
      to: ticketData.mail, // Email del usuario
      subject: "🎟️ Confirmación de Compra - Ticket Adjunto",
      text: `Hola ${ticketData.name},\n\nTu compra se ha realizado con éxito.\nAdjunto encontrarás tu ticket.\n\n¡Disfruta del evento!`,
      attachments: [
        {
          filename: `Ticket_${ticketData.name}.pdf`,
          path: pdfPath,
        },
      ],
    };

    // **Enviar el correo**
    await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado a:", ticketData.mail);

    // **Eliminar el archivo temporal después del envío**
    fs.unlinkSync(pdfPath);

    return { success: true, message: "Correo enviado con éxito." };
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    throw new Error("Error al enviar el correo.");
  }
};
