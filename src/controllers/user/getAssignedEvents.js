const { User, Show } = require('../../db');

module.exports = async (id) => {
  // 1️⃣ Validar usuario
  const user = await User.findByPk(id);
  if (!user || user.disabled) {
    throw { code: 404, message: "Usuario no encontrado o desactivado." };
  }
  if (!user.cashier && !user.isAdmin) {
    throw { code: 403, message: "El usuario no tiene permisos para consultar eventos asignados." };
  }

  // 2️⃣ Si assignedEvents está vacío, devolver todos los shows activos
  const assignedEvents = user.assignedEvents || [];
  if (assignedEvents.length === 0) {
    const allShows = await Show.findAll({ where: { state: true } });
    return allShows;
  }

  // 3️⃣ Buscar shows filtrados
  const shows = await Show.findAll({
    where: {
      id: assignedEvents,
      state: true
    }
  });

  return shows;
};