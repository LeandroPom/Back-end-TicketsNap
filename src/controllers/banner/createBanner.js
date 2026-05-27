// controllers/banner/createBanner

const fs = require("fs");
const path = require("path");

module.exports = async (name, url, static) => {
  try {

    if (!name || !url) {
      throw new Error("name y url son obligatorios.");
    }

    if (typeof static !== "boolean") {
      throw new Error("static debe ser true o false.");
    }

    const filePath = path.join(__dirname, "./Banners.json");

    if (!fs.existsSync(filePath)) {
      throw new Error("El archivo Banners.json no existe.");
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const Banners = JSON.parse(fileData);

    // 🔹 Determinar array objetivo
    const targetArray = static ? "staticArray" : "bannerArray";

    // 🔹 Asegurar existencia del array
    if (!Array.isArray(Banners[targetArray])) {
      Banners[targetArray] = [];
    }

    // 🔹 Verificar duplicados
    const exists = Banners[targetArray].some(
      banner =>
        banner.name.trim().toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (exists) {
      throw new Error(`Ya existe un banner con el nombre "${name}".`);
    }

    // 🔹 Crear banner
    const newBanner = {
      name: name.trim(),
      url: url.trim()
    };

    Banners[targetArray].push(newBanner);

    // 🔹 Guardar archivo
    fs.writeFileSync(
      filePath,
      JSON.stringify(Banners, null, 2),
      "utf-8"
    );

    console.log(`Banner agregado correctamente en ${targetArray}`);

    return Banners;

  } catch (error) {
    throw new Error(`Error al crear el banner: ${error.message}`);
  }
};