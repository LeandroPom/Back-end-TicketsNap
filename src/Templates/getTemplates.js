const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  try {
    const templatesDir = __dirname; // 👈 MISMA carpeta que los .json

    if (!fs.existsSync(templatesDir)) {
      return res.status(200).json([]);
    }
    

    const files = fs.readdirSync(templatesDir);

    const templates = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));

    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error leyendo templates:", error);
    return res.status(500).json({ message: "Error interno" });
  }
};
