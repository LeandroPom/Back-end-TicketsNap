const { Zone } = require('../db'); // Importa el modelo desde la conexión principal a la DB
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { name } = req.params;
  

  // Formatear el nombre de la plantilla
  const templateName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  try {
    console.log(`Iniciando la carga de la plantilla: ${templateName}...`);

    // Ruta al archivo JSON con la plantilla
    const templatePath = path.join(__dirname, `./${templateName}.json`);

    // Verificar si el archivo de la plantilla existe
    if (!fs.existsSync(templatePath)) {
      console.error(`Error: La plantilla "${templateName}" no existe en el directorio.`);
      return res.status(404).json({ message: `La plantilla "${templateName}" no existe.` });
    }

    // Leer el archivo JSON de la plantilla
    const zoneTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

    // Verificar si ya existe una plantilla con `isTemplate: true`
    const existingTemplate = await Zone.findOne({ where: { isTemplate: true } });

    if (existingTemplate) {
      console.log(`Error: Ya existe una plantilla cargada con "isTemplate: true".`);
      return res.status(400).json({
        message: `Error: Ya existe una plantilla cargada con "isTemplate: true".`,
      });
    }

    // Crear el registro en la base de datos
    await Zone.create(zoneTemplate);

    console.log(`Plantilla "${templateName}" cargada exitosamente.`);
    return res.status(200).json({
      zoneTemplate,
      message: `Plantilla "${templateName}" cargada exitosamente.`,
    });
  } catch (error) {
    console.error(`Error al cargar la plantilla "${templateName}":`, error);
    return res.status(500).json({
      message: 'Error al cargar la plantilla',
      error: error.message,
    });
  }
};
