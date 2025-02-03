const sellTicket = require('../../controllers/ticket/sellTicket');

module.exports = async (req, res) => {
  try {
    const { showId, zoneId, division, row, seatId, price, name, dni, mail, phone, userId, user } = req.body;

    // // Verificar si el usuario tiene la propiedad cashier: true
    // const user = await User.findByPk(userId); // Línea comentada si no se conecta aún con User
    // if (!user) {
    //   return res.status(404).json({ error: "Usuario no encontrado." });
    // }
    // if (!user.cashier) {
    //   return res.status(403).json({ error: "El usuario no tiene permisos de cajero." });
    // }

    // Llamar al controlador y devolver la respuesta
    const response = await sellTicket(showId, zoneId, division, row, seatId, price, name, dni, mail, phone, userId);

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Error interno del servidor." });
  }
};
