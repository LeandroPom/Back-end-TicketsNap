const { Ticket, Show, Zone, GeneralZone } = require("../../db");

module.exports = async (showId) => {
  try {
    
    // Buscar el show por ID
    const show = await Show.findByPk(showId);
    if (!show) {
      throw new Error(`Show con ID "${showId}" no encontrado.`);
    }

    // Eliminar zonas según el tipo de show
    if (show.isGeneral) {
      await GeneralZone.destroy({ where: { showId }, force: true });
    } else {
      await Zone.destroy({ where: { showId }, force: true });
    }

    // Eliminar todos los tickets asociados
    await Ticket.destroy({ where: { showId }, force: true });

    // Eliminar el show
    await show.destroy({ force: true });

    return {
      message: `El show con ID "${showId}" y todos sus elementos asociados fueron eliminados permanentemente.`
    };

  } catch (error) {
    console.error(`Error al eliminar el show y sus elementos asociados: ${error.message}`);
    throw new Error(`Error al eliminar el show: ${error.message}`);
  }
};
