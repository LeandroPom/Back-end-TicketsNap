const { Place } = require('../../db');

module.exports = async (id) => {

    try {

        const place = await Place.findByPk(id);
        if (!place) throw new Error(`Place with ID ${id} not found`);

        await Place.destroy({ where: { id: id } });

        console.log(`🗑️ Place con ID ${id} eliminado correctamente.`);

        return { message: `Place con ID ${id} eliminado correctamente.` };

    } catch (error) {

        console.error(`❌ Error en deletePlace: ${error.message}`);
        throw new Error(error.message);
    }
};
