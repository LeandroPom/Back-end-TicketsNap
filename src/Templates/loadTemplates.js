const { Zone } = require('../db'); // Importa el modelo desde la conexión principal a la DB
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {

  const {name} = req.params
  console.log(name)
  const templateName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  console.log(templateName)

  try {
    console.log(`Iniciando la carga de la plantilla: ${templateName}...`);

    // Ruta al archivo JSON con la plantilla
    const templatePath = path.join(__dirname, `./${templateName}.json`);

    // Verificar si el archivo de la plantilla existe
    if (!fs.existsSync(templatePath)) {
      console.error(`Error: La plantilla "${templateName}" no existe en el directorio.`);
      return;
    }

    // Leer el archivo JSON de la plantilla
    const zoneTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

    // Verificar si ya existe un registro con el mismo zoneName
    const existingZone = await Zone.findOne({
      where: { zoneName: zoneTemplate.zoneName },
    });

    if (existingZone) {
      console.log(`Error: Un registro con el zoneName "${zoneTemplate.zoneName}" ya existe.`);
      return;
    }

    // Crear el registro en la base de datos
    await Zone.create(zoneTemplate);

    console.log(`Plantilla "${templateName}" cargada exitosamente.`);
    res.status(200).json({zoneTemplate, message:`Plantilla "${templateName}" cargada exitosamente.`})

  } catch (error) {

    console.error(`Error al cargar la plantilla "${templateName}":`, error);
    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
}