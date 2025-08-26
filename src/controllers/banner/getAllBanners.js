const fs = require("fs");
const path = require("path");

module.exports = async () => {

    try {

        const filePath = path.join(__dirname, "./Banners.json");

        if (!fs.existsSync(filePath)) {
            throw new Error("El archivo Banners.json no existe.");
        }

        const fileData = fs.readFileSync(filePath, "utf-8");
        const Banners = JSON.parse(fileData);

        return Banners;

    } catch (error) {
        
        throw new Error(`Error al obtener los banners: ${error.message}`);

    }
};
