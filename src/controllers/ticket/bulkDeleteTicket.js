const seatManager = require("./seatManager");
const { Zone, GeneralZone, Ticket } = require('../../db');

module.exports = async (externalReference) => {
  try {
    // Paso 1: Extraer ticketIds y zoneId
    const regex = /ticketId:\s*([\d,]+),\s*zoneId:\s*(\d+)/;
    const match = externalReference.match(regex);

    if (!match) {
      throw new Error("Formato incorrecto en external_reference.");
    }

    const ticketIds = match[1].split(",").map(id => parseInt(id.trim(), 10));
    const zoneId = parseInt(match[2], 10);

    // Paso 2: Validar Zone o GeneralZone (solo una vez)
    const zone = await Zone.findByPk(zoneId);
    const generalZone = await GeneralZone.findByPk(zoneId);

    if (!zone && !generalZone) {
      throw new Error(`La zona con ID "${zoneId}" no existe.`);
    }

    // Paso 3: Llamar a seatManager para liberar y eliminar tickets
    const ticketsForSeatManager = ticketIds.map(id => ({ ticketId: id }));
    const result = await seatManager(ticketsForSeatManager, "kill");

    return result;

  } catch (error) {
    console.error(`❌ Error en deleteTicket: ${error.message}`);
    throw new Error(error.message);
  }
};
