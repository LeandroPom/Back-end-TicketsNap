// handlers/user/getAssignedEventsHandler.js

const getAssignedEvents = require('../../controllers/user/getAssignedEvents');

module.exports = async (req, res) => {

  const { id } = req.body;

  try {

    /**
     * -----------------------------------------------------------
     * 1️⃣ Ejecutar controller
     * -----------------------------------------------------------
     */

    const shows = await getAssignedEvents(id);

    /**
     * -----------------------------------------------------------
     * 2️⃣ Respuesta exitosa
     * -----------------------------------------------------------
     */

    res.status(200).json({
      assignedShows: shows
    });

  } catch (error) {

    /**
     * -----------------------------------------------------------
     * 3️⃣ Manejo de errores
     * -----------------------------------------------------------
     */

    const statusCode = error.code || 500;

    res.status(statusCode).json({
      error: error.message || "Error interno."
    });

  }

};