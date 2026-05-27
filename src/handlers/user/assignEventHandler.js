// handlers/user/assignEventHandler.js

const assignEvent = require('../../controllers/user/assignEvent');

module.exports = async (req, res) => {
  let { id, targetId, shows } = req.body;

  // 🔹 Asegurarse que shows sea un array (aunque venga vacío o null)
  if (!Array.isArray(shows)) shows = [];

  try {
    const updatedUser = await assignEvent(id, targetId, shows);

    res.status(200).json({
      message: "Eventos asignados correctamente.",
      user: updatedUser
    });
  } catch (error) {
    const statusCode = error.code || 500;

    res.status(statusCode).json({
      error: error.message || "Error interno."
    });
  }
};