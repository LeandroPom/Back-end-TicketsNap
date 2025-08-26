// ticketBufferController.js
const bulkActivateTicket = require('../../controllers/ticket/bulkActivateTicket');

// Buffer temporal en memoria
let ticketStorage = [];

/**
 * ticketStorage
 * - Si recibe external_reference (string) → flujo 1 (automatizado)
 * - Si recibe req, res (Express) → flujo 2 (endpoint)
 */
module.exports = async (arg1, arg2) => {
  try {
    // --- FLUJO 1: llamado automatizado ---
    if (typeof arg1 === 'string' && !arg2) {
      const ticket = await bulkActivateTicket(arg1);
      ticketStorage.push(ticket);
      return ticket;
    }

    // --- FLUJO 2: llamado desde endpoint ---
    if (arg1 && arg2 && typeof arg1 === 'object' && typeof arg2 === 'object') {
      const data = [...ticketStorage];
      ticketStorage = [];
      return arg2.status(200).json({ tickets: data });
    }

    throw new Error('Uso inválido de ticketBuffer.');
  } catch (error) {
    console.error("❌ Error en ticketBuffer:", error);
    if (arg2 && typeof arg2.status === 'function') {
      return arg2.status(500).json({ error: "Error interno en ticketBuffer." });
    } else {
      throw error;
    }
  }
}

