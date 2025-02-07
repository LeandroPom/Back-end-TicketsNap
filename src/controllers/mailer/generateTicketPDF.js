const PDFDocument = require("pdfkit");
const fs = require("fs");
const QRCode = require("qrcode");

module.exports = async (ticketData) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // **Guardar el PDF temporalmente**
    const filePath = `./temp_${ticketData.id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // **Título**
    doc.fontSize(24).text("🎟️ Ticket de Entrada", { align: "center" });
    doc.moveDown();

    // **Detalles del Ticket**
    doc.fontSize(16).text(`Show: ${ticketData.showName}`);
    doc.text(`Ubicación: ${ticketData.location}`);
    doc.text(`Fecha: ${ticketData.date}`);
    doc.text(`Función: ${ticketData.function}`);
    doc.text(`División: ${ticketData.division}`);
    doc.text(`Fila: ${ticketData.row}`);
    doc.text(`Asiento: ${ticketData.seat}`);
    doc.moveDown();

    try {
      // **Generar QR como imagen base64**
      const qrImageBase64 = ticketData.qrCode;

      // **Eliminar el prefijo "data:image/png;base64,"**
      const base64Image = qrImageBase64.split(",")[1];

      // **Convertir a Buffer**
      const imageBuffer = Buffer.from(base64Image, "base64");

      // **Guardar como archivo PNG**
      const qrFilePath = `./qr_${ticketData.id}.png`;
      fs.writeFileSync(qrFilePath, imageBuffer);

      // **Agregar QR al PDF**
      const qrX = 150; // Posición en X
      const qrY = doc.y; // Posición en Y después del texto
      doc.image(qrFilePath, qrX, qrY, { width: 200, height: 200 });
      doc.moveDown();

      // **Eliminar la imagen QR después de usarla**
      stream.on("finish", () => {
        fs.unlinkSync(qrFilePath); // Eliminar QR PNG
        resolve(filePath); // Retornar la ruta del PDF generado
      });

      stream.on("error", (error) => reject(error));
    } catch (err) {
      console.error("Error al generar el QR:", err);
      reject(err);
    }

    doc.end();
  });
};
