const fs = require("fs");
const path = require("path");

module.exports = async (name, url) => {

    try {

        const filePath = path.join(__dirname, "./Banners.json");

        if (!fs.existsSync(filePath)) {
            throw new Error("El archivo Banners.json no existe.");
        }

        const fileData = fs.readFileSync(filePath, "utf-8");
        const Banners = JSON.parse(fileData);

        // Verificar si name ya existe en el array
        const exists = Banners.bannerArray.some(banner => banner.name === name);
        if (exists) {
            throw new Error(`Ya existe un banner con el nombre "${name}".`);
        }

        // Crear nuevo banner
        const newBanner = { name, url };

        // Insertar al final del array
        Banners.bannerArray.push(newBanner);

        // Escribir el archivo con formato legible
        fs.writeFileSync(filePath, JSON.stringify(Banners, null, 2), "utf-8");

        console.log("Banner añadido correctamente");

        return Banners;
        
    } catch (error) {
        // Ideal para un entorno Express
        throw new Error(`Error al crear el banner: ${error.message}`);
    }
};
