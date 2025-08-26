const fs = require("fs");
const path = require("path");

module.exports = async (name) => {
    try {

        const filePath = path.join(__dirname, "./Banners.json");

        if (!fs.existsSync(filePath)) {
            throw new Error("El archivo Banners.json no existe.");
        }

        const fileData = fs.readFileSync(filePath, "utf-8");
        const Banners = JSON.parse(fileData);

        const originalLength = Banners.bannerArray.length;

        // Filtrar los banners que no coinciden con el name
       Banners.bannerArray = Banners.bannerArray.filter(
       banner => banner.name.trim().toLowerCase() !== name.trim().toLowerCase()
        );

        if (Banners.bannerArray.length === originalLength) {
            throw new Error(`No se encontró ningún banner con el nombre "${name}".`);
        }

        // Escribir los cambios en el archivo
        fs.writeFileSync(filePath, JSON.stringify(Banners, null, 2), "utf-8");

        console.log("Banner eliminado correctamente");

        return Banners;

    } catch (error) {
        throw new Error(`Error al eliminar el banner: ${error.message}`);
    }
};