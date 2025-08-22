const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = async (ticketsData = []) => {
  return new Promise((resolve, reject) => {
    try {
      if (!ticketsData.length) {
        throw new Error("No se proporcionaron tickets para generar el PDF.");
      }

      const doc = new PDFDocument({ size: "A4", margin: 50 });

      // Nombre archivo único
      const filePath = `./temp_tickets_${Date.now()}.pdf`;
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      ticketsData.forEach((ticketData, index) => {
        // ---- Cabecera ----
        doc.fontSize(28).fillColor("#003366").text("Ticket de Entrada", { align: "center" });
        doc.moveDown(1.5);

        // ---- Datos del show ----
        doc.fontSize(16).fillColor("black");
        doc.text(`Show: ${ticketData.showName}`, { continued: true });
        doc.text(`Ubicación: ${ticketData.location}`);
        doc.text(`Fecha: ${ticketData.date}`);
        doc.text(`Función: ${ticketData.function}`);
        doc.moveDown();

        // ---- Zona / Asiento ----
        doc.text(`Zona: ${ticketData.division}`);
        doc.text(`Precio: $${ticketData.price}`);
        if (ticketData.row) doc.text(`Fila: ${ticketData.row}`);
        if (ticketData.seat) doc.text(`Asiento: ${ticketData.seat}`);
        doc.moveDown();

        // ---- Comprador ----
        doc.text(`Nombre: ${ticketData.name}`);
        doc.text(`DNI: ${ticketData.dni || "N/A"}`);
        doc.moveDown(2);

        // ---- QR ----
        if (ticketData.qrCode) {
          const base64Image = ticketData.qrCode.split(",")[1];
          const imageBuffer = Buffer.from(base64Image, "base64");
          const qrSize = 180;
          const pageWidth = doc.page.width;
          const qrX = (pageWidth - qrSize) / 2;
          doc.image(imageBuffer, qrX, doc.y, { width: qrSize, height: qrSize });
        }

        // Si no es el último ticket, agregamos una nueva página
        if (index < ticketsData.length - 1) {
          doc.addPage();
        }
      });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => reject(err));
    } catch (error) {
      console.error("Error generando PDF múltiple:", error);
      reject(error);
    }
  });
};