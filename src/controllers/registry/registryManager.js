// src/controllers/registry/registryManager.js

const fs = require("fs").promises;
const path = require("path");
const { Show } = require("../../db");

module.exports = async (payload, mode = "file") => {
  try {
    // **1. Recuperar registry.json**
    const registryPath = path.join(__dirname, "registry.json");
    const registryJSON = JSON.parse(
      await fs.readFile(registryPath, "utf8")
    );

    // **2. Validar estructura del registro**
    if (!Array.isArray(registryJSON.deletedTickets))
      throw new Error("Estructura inválida en registry.json.");

    // **3. Registrar ticket eliminado**
    if (mode === "file") {

      // **Extraer datos del objeto Sequelize**
      const {
        id,
        userId,
        zoneId,
        showId,
        division,
        location,
        date,
        row,
        seat,
        price,
        chargePrice,
        name,
        dni,
        mail,
        phone,
        qrToken,
        createdAt,
      } = payload.dataValues;

      // **Recuperar información del Show**
      const show = await Show.findByPk(showId);

      if (!show)
        throw new Error(`Show con ID "${showId}" no encontrado.`);

      // **Construir objeto para registry**
      const data = {
        id,
        userId,
        zoneId,
        showId,
        showName: show.name,
        division,
        location,
        date,
        row,
        seat,
        price,
        chargePrice,
        name,
        dni,
        mail,
        phone,
        qrToken,
        createdAt,
      };

      // **Buscar ticket duplicado mediante loop**
      let exists = false;

      for (const ticket of registryJSON.deletedTickets) {
        if (Number(ticket.id) === Number(id)) {
          exists = true;
          break;
        }
      }

      // **Registrar únicamente si no existe**
      if (!exists)
        registryJSON.deletedTickets.push(data);
    }

    // **4. Limpiar tickets asociados a un Show**
    else if (mode === "clear") {

      // **Payload representa directamente el showId**
      const showId = Number(payload);

      if (!showId)
        throw new Error("showId es obligatorio para limpiar el registro.");

      // **Reconstruir array conservando otros shows**
      registryJSON.deletedTickets = registryJSON.deletedTickets
        .map(ticket =>
          Number(ticket.showId) !== showId
            ? ticket
            : null
        )
        .filter(ticket => ticket !== null);
    }

    // **5. Validar modo**
    else {
      throw new Error(`Mode "${mode}" no es válido.`);
    }

    // **6. Sobrescribir registry.json**
    await fs.writeFile(
      registryPath,
      JSON.stringify(registryJSON, null, 2),
      "utf8"
    );

    // **7. Respuesta final**
    return {
      message:
        mode === "file"
          ? "Ticket registrado correctamente."
          : `Registros del show "${payload}" eliminados correctamente.`,
    };

  } catch (error) {

    // **8. Captura centralizada de errores**
    console.error(`❌ Error en registryManager: ${error.message}`);

    throw new Error(`registryManager: ${error.message}`);
  }
};
