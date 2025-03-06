const fs = require("fs");
const path = require("path");
const { GeneralZone } = require("../../db");

// **Controlador para crear una GeneralZone**
module.exports = async ({ showId, updates, templateName }) => {
  try {
    const filePath = path.join(__dirname, `../../Templates/${templateName}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`El archivo JSON "${templateName}" no existe.`);
    }

    const jsonData = fs.readFileSync(filePath, "utf8");
    const jsonTemplate = JSON.parse(jsonData);

    // **Verificar duplicados en base a date y time de presentation**
    const { date, time } = updates.presentation || {};
    if (!date || !time) {
      throw new Error('Las propiedades "date" y "time" son obligatorias en presentation.');
    }

    const existingZone = await GeneralZone.findOne({
      where: {
        "presentation.date": date,
        "presentation.time": time,
      },
    });

    if (existingZone) {
      throw new Error(`Ya existe una zona con la fecha "${date}" y el horario "${time}".`);
    }

    // **Modificar la plantilla con los datos proporcionados**
    jsonTemplate.showId = showId;
    jsonTemplate.isTemplate = false; // No es plantilla
    jsonTemplate.presentation = {
      ...jsonTemplate.presentation,
      ...updates.presentation,
    };

    // **Actualizar `location` con los valores de `updates.location`**
    if (updates.location) {
      jsonTemplate.location = updates.location.map((div) => ({
        division: div.division,
        price: div.price,
        space: div.space,
        occupied: div.occupied || 0,
        ...(div.division === "Vip" && div.hasVip !== undefined ? { hasVip: div.hasVip } : {}),
      }));
    }

    // **Crear nuevo registro en la base de datos**
    const newGeneralZone = await GeneralZone.create(jsonTemplate);

    return newGeneralZone;
  } catch (error) {
    console.error("Error en el controlador addGeneralZone:", error);
    throw error;
  }
};
