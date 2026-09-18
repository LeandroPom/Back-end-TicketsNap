// controllers/ticket/bulkCancelTicket.js

const seatManager = require("./seatManager");

module.exports = async (ticketIds) => {
  try {
    // **Normalizar ID singular o múltiples IDs**
    const ids = Array.isArray(ticketIds)
      ? ticketIds
      : [ticketIds];

    // **Validar que existan IDs**
    if (!ids.length || ids.some((id) => !id)) {
      throw new Error("Debe proporcionar al menos un ticketId válido.");
    }

    // **Convertir IDs al formato utilizado por seatManager**
    const ticketsData = ids.map((ticketId) => ({ ticketId }));

    // **kill → liberar asiento/espacio + eliminar ticket**
    return await seatManager(ticketsData, "kill");
  } catch (error) {
    // **Error centralizado de cancelación**
    console.error(
      `❌ Error en bulkCancelTicket: ${error.message}`
    );

    throw new Error(
      `Error en bulkCancelTicket: ${error.message}`
    );
  }
};
