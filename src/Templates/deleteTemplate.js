//src/templates/deleteTemplate.js
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const { name } = req.params;

  // 馃敼 Normalizacion consistente con loadTemplates
  const templateName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  try {
    console.log(`Intentando eliminar plantilla: ${templateName}...`);

    const templatesDir = __dirname;

    // 馃敼 Seguridad: evitar path traversal (ej: ../../algo)
    if (templateName.includes("..") || templateName.includes("/") || templateName.includes("\\")) {
      return res.status(400).json({
        message: "Nombre de plantilla inv谩lido",
      });
    }

    const filePath = path.join(templatesDir, `${templateName}.json`);

    // 馃敼 Verificar que el archivo exista
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: `La plantilla "${templateName}" no existe.`,
      });
    }

    // 馃敼 Validaci贸n extra: asegurarnos que es un archivo .json real
    if (path.extname(filePath) !== ".json") {
      return res.status(400).json({
        message: "El archivo no es un template v谩lido (.json).",
      });
    }

    // 馃敼 Eliminaci贸n
    fs.unlinkSync(filePath);
    
    // 馃敼 Verificaci贸n posterior (MUY importante)
    const stillExists = fs.existsSync(filePath);

    if (stillExists) {
      console.error(`Error: la plantilla "${templateName}" no se elimin贸 correctamente.`);
      return res.status(500).json({
        message: `No se pudo eliminar la plantilla "${templateName}".`,
      });
    }

    console.log(`Plantilla "${templateName}" eliminada correctamente.`);

    return res.status(200).json({
      message: `Plantilla "${templateName}" eliminada con 茅xito.`,
      deletedTemplate: templateName,
    });

  } catch (error) {
    console.error(`Error al eliminar la plantilla "${templateName}":`, error);
    return res.status(500).json({
      message: "Error al eliminar la plantilla",
      error: error.message,
    });
  }
};