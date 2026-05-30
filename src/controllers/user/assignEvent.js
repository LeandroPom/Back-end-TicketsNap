// controllers/user/assignEvent.js

const { User, Show } = require('../../db');

module.exports = async (id, targetId, shows) => {

  /**
   * -----------------------------------------------------------
   * 1️⃣ Validación básica de parámetros
   * -----------------------------------------------------------
   */
  if (!id || !targetId) {
    throw { code: 400, message: "id y targetId son obligatorios." };
  }

  if (shows && !Array.isArray(shows)) {
    throw { code: 400, message: "shows debe ser un array de IDs." };
  }

  /**
   * -----------------------------------------------------------
   * 2️⃣ Validar usuario administrador (id)
   * -----------------------------------------------------------
   */
  const adminUser = await User.findByPk(id);

  if (!adminUser || adminUser.disabled) {
    throw { code: 404, message: "Usuario administrador no encontrado o desactivado." };
  }

  if (!adminUser.isAdmin) {
    throw { code: 403, message: "El usuario no tiene permisos de administrador." };
  }

  /**
   * -----------------------------------------------------------
   * 3️⃣ Validar usuario objetivo (targetId)
   * -----------------------------------------------------------
   */
  const targetUser = await User.findByPk(targetId);

  if (!targetUser || targetUser.disabled) {
    throw { code: 404, message: "Usuario target no encontrado o desactivado." };
  }

  if (!targetUser.cashier && !targetUser.isAdmin) {
    throw { code: 403, message: "El usuario target no es un cashier ni admin." };
  }

  /**
   * -----------------------------------------------------------
   * 3.5️⃣ 🔹 Sanitizar assignedEvents actuales del usuario
   * -----------------------------------------------------------
   */
  let currentAssigned = targetUser.assignedEvents || [];

  if (!Array.isArray(currentAssigned)) {
    currentAssigned = [];
  }

  if (currentAssigned.length > 0) {
    const existingAssignedShows = await Show.findAll({
      where: { id: currentAssigned }
    });

    const validAssignedIds = existingAssignedShows.map(show => show.id);

    // 🔹 Actualizamos solo con los shows que realmente existen
    await targetUser.update({
      assignedEvents: validAssignedIds.length > 0 ? validAssignedIds : []
    });
  } else {
    // 🔹 Si no hay nada, nos aseguramos que sea array vacío
    await targetUser.update({ assignedEvents: [] });
  }

  /**
   * -----------------------------------------------------------
   * 4️⃣ Si shows está vacío o no existe -> vaciar assignedEvents
   * -----------------------------------------------------------
   */
  if (!shows || shows.length === 0) {
    await targetUser.update({ assignedEvents: [] });
    return targetUser;
  }

  /**
   * -----------------------------------------------------------
   * 5️⃣ Validar existencia y estado de todos los shows
   * -----------------------------------------------------------
   */
  const existingShows = await Show.findAll({
    where: { id: shows }
  });

  const validShowIds = existingShows
    .filter(show => show.state === true)
    .map(show => show.id);

  if (validShowIds.length !== shows.length) {
    throw {
      code: 400,
      message: "Uno o más shows no existen o están desactivados."
    };
  }

  /**
   * -----------------------------------------------------------
   * 6️⃣ Asignar shows válidos
   * -----------------------------------------------------------
   */
  await targetUser.update({ assignedEvents: validShowIds });

  /**
   * -----------------------------------------------------------
   * 7️⃣ Retornar usuario actualizado
   * -----------------------------------------------------------
   */
  return targetUser;
};