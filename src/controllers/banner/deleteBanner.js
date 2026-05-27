// controllers/banner/deleteBanner

const fs = require("fs");
const path = require("path");

module.exports = async (name, static) => {

  try {

    if (!name) {
      throw new Error("name es obligatorio.");
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

    // 🔹 Validar array
    if (!Array.isArray(Banners[targetArray])) {
      Banners[targetArray] = [];
    }

    const originalLength = Banners[targetArray].length;

    // 🔹 Eliminar banner
    Banners[targetArray] = Banners[targetArray].filter(
      banner =>
        banner.name.trim().toLowerCase() !==
        name.trim().toLowerCase()
    );

    // 🔹 Verificar eliminación
    if (Banners[targetArray].length === originalLength) {
      throw new Error(
        `No se encontró ningún banner con el nombre "${name}".`
      );
    }

    // 🔹 Guardar cambios
    fs.writeFileSync(
      filePath,
      JSON.stringify(Banners, null, 2),
      "utf-8"
    );

    console.log(`Banner eliminado correctamente de ${targetArray}`);

    return Banners;

  } catch (error) {

    throw new Error(`Error al eliminar el banner: ${error.message}`);

  }
};