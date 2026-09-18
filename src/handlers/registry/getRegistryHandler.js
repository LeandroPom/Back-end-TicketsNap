//handlers/registry/getRegistryHandler.js
const getRegistry = require("../../controllers/registry/getRegistry");


module.exports = async (req, res) => {
    try {

        // **Obtener registro de tickets eliminados**
        const result = await getRegistry(req.body);

        return res.status(200).json(result);

    } catch (error) {

        console.error("❌ Error en ruta /registry:", error.message);

        return res.status(400).json({
            error: error.message,
        });
    }
};