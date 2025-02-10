const editShow = require('../../controllers/show/editShow');

module.exports = async (req, res) => {
    // // Paso 1: Validar permisos del usuario
    // if (!req.body.user?.isAdmin) {
    //     return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    // }

    // Paso 2: Extraer datos del cuerpo de la solicitud
    const { id, updates } = req.body;

    // Paso 3: Validar que se proporcione un identificador
    if (!id) {
        return res.status(400).json({
            error: 'Debes proporcionar un "id" para localizar el show.',
        });
    }

    // Paso 4: Validar que updates sea un objeto
    if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
            error: 'Debes proporcionar un objeto de "updates" con los campos a modificar.',
        });
    }

    try {
        // Paso 5: Llamar al controlador para editar el show
        const updatedShow = await editShow(id, updates);

        // Paso 6: Enviar respuesta al cliente
        res.status(200).json({
            message: 'Show actualizado exitosamente',
            show: updatedShow,
        });
        
    } catch (error) {
        // Paso 7: Manejo de errores
        res.status(500).json({
            error: 'Error al actualizar el show',
            details: error.message,
        });
    }
};
