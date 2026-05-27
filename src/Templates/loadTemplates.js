const { Zone } = require('../db');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { name } = req.params;
  const templateName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  try {
    console.log(`Cargando plantilla: ${templateName}...`);

    const templatePath = path.join(__dirname, `./${templateName}.json`);
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: `La plantilla "${templateName}" no existe.` });
    }

    // Leemos el JSON directamente
    const zoneTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
    zoneTemplate.zoneName = templateName; // opcional, para identificar

    // Buscamos en DB si ya existe **para ese template específico**
    let existingTemplate = await Zone.findOne({
      where: { isTemplate: true, showId: 0, /* aquí podrías usar zoneName si la agregás */ }
    });

    // ⚠️ Validamos si la DB tiene la plantilla exacta
    if (existingTemplate && existingTemplate.zoneName === templateName) {
      console.log(`Plantilla "${templateName}" ya existe en DB.`);
      return res.status(200).json({
        zoneTemplate: existingTemplate,
        message: `Plantilla "${templateName}" cargada desde DB.`,
      });
    }

    // Si no existe en DB, devolvemos el JSON original
    console.log(`Plantilla "${templateName}" no existe en DB, se usará el JSON.`);
    return res.status(200).json({
      zoneTemplate,
      message: `Plantilla "${templateName}" cargada desde JSON.`,
    });

  } catch (error) {
    console.error(`Error al cargar la plantilla "${templateName}":`, error);
    return res.status(500).json({
      message: 'Error al cargar la plantilla',
      error: error.message,
    });
  }
};
