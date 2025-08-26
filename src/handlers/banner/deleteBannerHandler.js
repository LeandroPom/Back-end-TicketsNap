const deleteBanner = require('../../controllers/banner/deleteBanner');

module.exports = async (req, res) => {

    const { name } = req.params;

    try {

        if (!name) {
            throw new Error("El parámetro 'name' es obligatorio.");
        }

        const banner = await deleteBanner(name);

        return res.status(200).json(banner);

    } catch (error) {

        return res.status(404).json({ error: error.message });
    }
};
