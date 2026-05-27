const deleteBanner = require('../../controllers/banner/deleteBanner');

module.exports = async (req, res) => {

    const { name, static: isStatic } = req.params;

    try {

        if (!name || typeof isStatic === "undefined") {
            throw new Error("name y static son obligatorios.");
        }

        const parsedStatic = isStatic === "true";

        const banner = await deleteBanner(name, parsedStatic);

        return res.status(200).json(banner);

    } catch (error) {

        return res.status(404).json({ error: error.message });
    }
};