// src/controllers/registry/getRegistry.js
const fs = require("fs").promises;
const path = require("path");
const filePassword = "registro";

module.exports = async (body = {}) => {
  try {
    // **1. Validar contraseña de acceso**
    const { password } = body;

    if (password !== filePassword)
      throw new Error("Contraseña incorrecta.");

    // **2. Recuperar registry.json**
    const registryPath = path.join(__dirname, "registry.json");
    const registryJSON = JSON.parse(
      await fs.readFile(registryPath, "utf8")
    );

    // **3. Agrupar tickets por show**
    const registry = [];

    for (const ticket of registryJSON.deletedTickets || []) {

      // **Buscar grupo del show**
      let show = registry.find(
        item => Number(item.showId) === Number(ticket.showId)
      );

      // **Crear grupo si no existe**
      if (!show) {
        show = {
          showId: ticket.showId,
          showName: ticket.showName,
          tickets: [],
        };

        registry.push(show);
      }

      // **Agregar ticket al grupo**
      show.tickets.push(ticket);
    }

    // **4. Retornar registro agrupado**
    return { registry };

  } catch (error) {

    // **5. Captura centralizada de errores**
    console.error(`❌ Error en getRegistry: ${error.message}`);

    throw new Error(`getRegistry: ${error.message}`);
  }
};