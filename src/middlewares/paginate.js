/**
 * Middleware de paginación para Express.js.
 * Este middleware se utiliza para paginar datos ya procesados en memoria.
 * 
 * ### Cómo usar:
 * 1. Pasa los datos procesados como `res.locals.data` en tu controlador.
 * 2. Asegúrate de que los datos sean un array o un objeto con una propiedad `items`.
 * 3. Aplica este middleware en tu ruta para devolver los datos paginados.
 * 
 * ### Parámetros admitidos:
 * - `currentPage`: Número de página solicitada (default: 1).
 * - `itemsPerPage`: Cantidad de elementos por página (default: 10).
 */

module.exports = (req, res, next) => {
    try {
        // Paso 1: Obtener los datos procesados
        const data = res.locals.data;
        if (!data) {
            return res.status(500).json({ error: "No hay datos para paginar. Asegúrate de configurarlos en res.locals.data." });
        }

        // Paso 2: Validar si es un array u objeto
        const items = Array.isArray(data) ? data : data.items;
        if (!items || !Array.isArray(items)) {
            return res.status(500).json({ error: "Los datos deben ser un array o un objeto con una propiedad 'items'." });
        }

        // Paso 3: Leer parámetros de paginación
        const currentPage = parseInt(req.query.currentPage) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;

        if (itemsPerPage <= 0) {
            return res.status(400).json({ error: "'itemsPerPage' debe ser mayor a 0." });
        }

        // Paso 4: Calcular índices de paginación
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const validPage = Math.min(Math.max(currentPage, 1), totalPages);
        const startIndex = (validPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        // Paso 5: Construir respuesta paginada
        const paginatedData = {
            currentPage: validPage,
            itemsPerPage,
            totalItems,
            totalPages,
            data: items.slice(startIndex, endIndex),
            // nextPage: validPage < totalPages ? `${req.baseUrl}${req.path}?currentPage=${validPage + 1}&itemsPerPage=${itemsPerPage}` : null, // Descomenta para enlaces
            // prevPage: validPage > 1 ? `${req.baseUrl}${req.path}?currentPage=${validPage - 1}&itemsPerPage=${itemsPerPage}` : null, // Descomenta para enlaces
        };

        // Paso 6: Enviar datos paginados
        res.json(paginatedData);
    } catch (error) {
        console.error("Error en el middleware de paginación:", error);
        res.status(500).json({ error: "Error interno al procesar la paginación." });
    }
};

