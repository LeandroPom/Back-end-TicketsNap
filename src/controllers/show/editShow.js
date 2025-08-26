const { Show, Place, Tag } = require('../../db');

module.exports = async (id, updates) => {
    try {
        // Paso 1: Buscar el show por ID
        const show = await Show.findByPk(id);

        if (!show) {
            throw { code: 404, message: 'No se encontró ningún show con el ID proporcionado.' };
        }

        // Paso 2: Validar y aplicar las actualizaciones
        const updatedFields = {};

        // Validar y actualizar `presentation`
        if (updates.presentation !== undefined) {
            if (!Array.isArray(updates.presentation)) {
                throw { code: 400, message: 'El campo "presentation" debe ser un arreglo.' };
            }
            updates.presentation.forEach(item => {
                if (
                    typeof item.date !== 'string' ||
                    !item.performance ||
                    !item.time ||
                    typeof item.time.start !== 'string' ||
                    typeof item.time.end !== 'string'
                ) {
                    throw { code: 400, message: 'Cada presentación debe tener "date", "performance", y "time" con "start" y "end".' };
                }
            });
            updatedFields.presentation = updates.presentation;
        }

        // Validar y actualizar `genre` (tags)
        if (updates.genre !== undefined) {
            if (!Array.isArray(updates.genre)) {
                throw { code: 400, message: 'El campo "genre" debe ser un arreglo.' };
            }

            // Normalizar géneros
            const normalizedGenres = updates.genre.map(tag =>
                tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
            );

            // Buscar géneros existentes
            const existingTags = await Tag.findAll({
                where: { name: normalizedGenres },
                attributes: ['name']
            });

            const existingTagNames = existingTags.map(tag => tag.name);

            // Detectar géneros inválidos
            const invalidGenres = normalizedGenres.filter(tag => !existingTagNames.includes(tag));
            if (invalidGenres.length > 0) {
                throw {
                    code: 400,
                    message: `Los siguientes géneros no son válidos: ${invalidGenres.join(', ')}`
                };
            }

            updatedFields.genre = normalizedGenres;
        }

        // Reemplazar completamente `artists`
        if (updates.artists !== undefined) {
            if (!Array.isArray(updates.artists)) {
                throw { code: 400, message: 'El campo "artists" debe ser un arreglo.' };
            }
            updatedFields.artists = updates.artists;
        }

        // Otros campos simples que no necesitan validaciones complejas
        ['state', 'name', 'description', 'coverImage'].forEach(field => {
            if (updates[field] !== undefined) {
                updatedFields[field] = updates[field];
            }
        });

        // Paso 3: Aplicar las actualizaciones al modelo
        await show.update(updatedFields);

        // Paso 4: Log de éxito en la terminal
        console.log(`Show actualizado exitosamente: ${show.name}`);
        console.log('Campos modificados:', Object.keys(updatedFields));

        // Paso 5: Retornar el objeto actualizado
        return show;
    } catch (error) {
        console.error('Error al actualizar el show:', error.message || error);
        throw error;
    }
};
