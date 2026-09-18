// controllers/ticket/seatManager.js

const { Zone, GeneralZone, Ticket } = require("../../db");
const registryManager = require('../registry/registryManager')

module.exports = async (ticketsData = [], action = "buy") => {
  try {
    // **Validación inicial de parámetros**
    if (!["buy", "kill"].includes(action))
      throw new Error(`Action "${action}" no es válida.`);

    // **Procesar tickets recibidos**
    for (const { ticketId } of ticketsData) {
      if (!ticketId)
        throw new Error("ticketId es obligatorio.");

      // **1. Recuperar ticket**
      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket)
        throw new Error(`Ticket "${ticketId}" no encontrado.`);

      // **2. Recuperar posibles zonas**
      // Zone y GeneralZone utilizan IDs INTEGER independientes,
      // por eso se consultan ambos modelos antes de determinar el tipo.
      const [zone, generalZone] = await Promise.all([
        Zone.findByPk(ticket.zoneId),
        GeneralZone.findByPk(ticket.zoneId),
      ]);

      // **3. Determinar tipo de zona mediante su estructura**
      // Todas las divisiones con "space" → GeneralZone.
      // Una o más divisiones con rows/seats → Zone.
      const model =
        zone?.location?.some(
          (division) =>
            Array.isArray(division.rows) &&
            division.rows.some((row) =>
              Array.isArray(row.seats)
            )
        )
          ? zone
          : generalZone?.location?.every(
            (division) => "space" in division
          )
            ? generalZone
            : null;

      if (!model)
        throw new Error(
          `No se pudo determinar la zona "${ticket.zoneId}".`
        );

      // **4. Actualizar asiento o espacio**
      const updatedLocation = model.location.map((division) => {
        if (division.division !== ticket.division)
          return division;

        // **División con filas y asientos**
        if (Array.isArray(division.rows)) {
          return {
            ...division,

            rows: division.rows.map((row) =>
              Number(row.row) !== Number(ticket.row)
                ? row
                : {
                  ...row,

                  seats: row.seats.map((seat) =>
                    Number(seat.id) !== Number(ticket.seat)
                      ? seat
                      : {
                        ...seat,
                        taken: action === "buy",
                      }
                  ),
                }
            ),
          };
        }

        // **División de espacio general**
        return {
          ...division,

          occupied:
            action === "buy"
              ? (Number(division.occupied) || 0) + 1
              : Math.max(
                0,
                (Number(division.occupied) || 0) - 1
              ),
        };
      });

      // **5. Guardar zona modificada**
      const Model = zone === model ? Zone : GeneralZone;

      await Model.update(
        { location: updatedLocation },
        { where: { id: ticket.zoneId } }
      );


      // **6. Registrar y eliminar ticket**
      if (action === "kill") {

        // **Registrar ticket antes de eliminarlo**
        await registryManager(ticket, "file");

        // **Eliminar ticket después de liberar el espacio**
        await Ticket.destroy({
          where: { id: ticketId },
        });
      }
    }

    // **7. Respuesta final**
    return {
      message:
        action === "buy"
          ? "Ocupación actualizada correctamente."
          : "Espacio liberado correctamente.",
    };
  } catch (error) {
    // **Captura centralizada de errores**
    console.error(
      `❌ Error en seatManager: ${error.message}`
    );

    throw new Error(
      `Error en seatManager: ${error.message}`
    );
  }
};
