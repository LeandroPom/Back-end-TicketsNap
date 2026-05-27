const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  try {
    const {
      templateName,
      location,
      zoneName,
      zoneImageUrl,
      zoneImageWidth,
      zoneImageHeight,
    } = req.body;

    if (!templateName || !location || !location.length) {
      return res.status(400).json({ message: "Datos incompletos" });
    }
    

    // Validar IDs y preparar divisionImageUrl y tamaños
    location.forEach((div) => {
      div.rows?.forEach((row) => {
        row.seats?.forEach((seat) => {
          seat.id = Number(seat.id);
        });
        row.row = Number(row.row);
        row.rowPrice = Number(row.rowPrice || 0);
      });
      div.generalPrice = Number(div.generalPrice || 0);
      div.divisionImageUrl = div.divisionImageUrl || null;
      div.divisionImageWidth = div.divisionImageWidth || null;  // ✅ nuevo
      div.divisionImageHeight = div.divisionImageHeight || null; // ✅ nuevo
    });

    const template = {
      showId: 0,
      isTemplate: true,
      generalTicket: true,
      zoneName: zoneName || "Zona Base",
      zoneImageUrl: zoneImageUrl || null,
      zoneImageWidth: zoneImageWidth || null,   // ✅ nuevo
      zoneImageHeight: zoneImageHeight || null, // ✅ nuevo
      presentation: {
        date: "2026-01-01",
        time: { start: "00:00", end: "01:00" },
        performance: 1,
      },
      location,
    };

    const filePath = path.join(
      __dirname,
      `../../Templates/${templateName}.json`
    );

    if (fs.existsSync(filePath)) {
      return res.status(409).json({ message: "El template ya existe" });
    }

    fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
    

    return res.status(201).json({
      message: "Template creado correctamente",
      templateName,
    });

  } catch (error) {
    console.error("Error creando template:", error);
    res.status(500).json({ message: "Error interno" });
  }
};