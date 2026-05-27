const { Ticket, Show, Zone, GeneralZone, User } = require("../../db");

module.exports = async (showId) => {
  try {

    const numericShowId = Number(showId); // 🔥 FIX CLAVE

    // 🔹 Buscar el show por ID
    const show = await Show.findByPk(showId);
    if (!show) {
      throw new Error(`Show con ID "${showId}" no encontrado.`);
    }

    /**
     * -----------------------------------------------------------
     * 🆕 Limpiar assignedEvents en usuarios cashier
     * -----------------------------------------------------------
     */
    const cashiers = await User.findAll({
      where: { cashier: true }
    });

    for (const user of cashiers) {
      let assigned = user.assignedEvents || [];

      if (!Array.isArray(assigned) || assigned.length === 0) continue;

      // 🔹 FIX: usar numericShowId
      const filtered = assigned.filter(id => id !== numericShowId);

      if (filtered.length !== assigned.length) {
        await user.update({
          assignedEvents: filtered.length > 0 ? filtered : []
        });
      }
    }

    /**
     * -----------------------------------------------------------
     * 🔹 Eliminar zonas según el tipo de show
     * -----------------------------------------------------------
     */
    if (show.isGeneral) {
      await GeneralZone.destroy({ where: { showId }, force: true });
    } else {
      await Zone.destroy({ where: { showId }, force: true });
    }

    /**
     * -----------------------------------------------------------
     * 🔹 Eliminar todos los tickets asociados
     * -----------------------------------------------------------
     */
    await Ticket.destroy({ where: { showId }, force: true });

    /**
     * -----------------------------------------------------------
     * 🔹 Eliminar el show
     * -----------------------------------------------------------
     */
    await show.destroy({ force: true });

    return {
      message: `El show con ID "${showId}" y todos sus elementos asociados fueron eliminados permanentemente.`,
    };

  } catch (error) {
    console.error(`Error al eliminar el show y sus elementos asociados: ${error.message}`);
    throw new Error(`Error al eliminar el show: ${error.message}`);
  }
};