// // controllers/ticket/seatManager.js
// const { Zone, GeneralZone, Ticket } = require("../../db");

// module.exports = async (ticketsData = [], action = "buy") => {
//   try {
//     for (const { ticketId } of ticketsData) {
//       if (!ticketId) throw new Error("ticketId es obligatorio.");

//       // 1️⃣ Recuperar ticket de la DB
//       const ticket = await Ticket.findByPk(ticketId);
//       if (!ticket) throw new Error(`Ticket con ID ${ticketId} no encontrado.`);

//       const { zoneId, division, row, seat } = ticket;

//       // 2️⃣ Recuperar la zona correspondiente
//       const zone = await Zone.findByPk(zoneId);
//       const generalZone = await GeneralZone.findByPk(zoneId);

//       // 3️⃣ Lógica para Zone con asientos específicos
//       if (zone) {
//         if (row || seat) {
//           let updatedLocation = [...zone.location];
//           updatedLocation = updatedLocation.map(div => {
//             if (div.division === division) {
//               div.rows = div.rows.map(r => {
//                 if (r.row === parseInt(row)) {
//                   r.seats = r.seats.map(s =>
//                     s.id === parseInt(seat)
//                       ? { ...s, taken: action === "buy" ? true : false }
//                       : s
//                   );
//                 }
//                 return r;
//               });
//             }
//             return div;
//           });

//           await Zone.update({ location: updatedLocation }, { where: { id: zoneId } });
//         }

//         // 4️⃣ Lógica para Zone tipo "Tribunas Generales"
//         else if (division === "Tribunas Generales") {
//           let updatedLocation = [...zone.location];
//           updatedLocation = updatedLocation.map(div =>
//             div.division === division
//               ? {
//                   ...div,
//                   occupied:
//                     action === "buy"
//                       ? div.occupied + 1
//                       : Math.max(0, div.occupied - 1),
//                 }
//               : div
//           );

//           await Zone.update({ location: updatedLocation }, { where: { id: zoneId } });
//         }
//       }

//       // 5️⃣ Lógica para GeneralZone
//       if (generalZone) {
//         let updatedLocation = [...generalZone.location];
//         updatedLocation = updatedLocation.map(div =>
//           div.division === division
//             ? {
//                 ...div,
//                 occupied:
//                   action === "buy"
//                     ? div.occupied + 1
//                     : Math.max(0, div.occupied - 1),
//               }
//             : div
//         );

//         await GeneralZone.update({ location: updatedLocation }, { where: { id: zoneId } });
//       }

//       // 6️⃣ Eliminar ticket si la acción es "kill"
//       if (action === "kill") {
//         await Ticket.destroy({ where: { id: ticketId } });
//         console.log(`🗑️ Ticket con ID ${ticketId} eliminado correctamente.`);
//       }
//     }

//     return {
//       message:
//         action === "buy"
//           ? "Ocupación actualizada correctamente."
//           : "Liberación de asientos/lugares completada.",
//     };
//   } catch (error) {
//     console.error("Error en seatManager:", error.message);
//     throw new Error(error.message);
//   }
// };


// controllers/ticket/seatManager.js

// controllers/ticket/seatManager.js

const { Zone, GeneralZone, Ticket } = require("../../db");

module.exports = async (ticketsData = [], action = "buy") => {

  try {

    for (const { ticketId } of ticketsData) {

      if (!ticketId)
        throw new Error("ticketId es obligatorio.");

      // 1️⃣ Recuperar ticket
      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket)
        throw new Error(`Ticket con ID ${ticketId} no encontrado.`);

      const { zoneId, division, row, seat } = ticket;

      // ✅ Detectar correctamente si tiene asientos
      const hasSeats =
        row !== null &&
        row !== undefined &&
        seat !== null &&
        seat !== undefined;

      /**
       * =====================================================
       * 🎟️ TICKETS CON ASIENTOS
       * =====================================================
       */
      if (hasSeats) {

        const zone = await Zone.findByPk(zoneId);

        if (!zone)
          throw new Error(`Zone ${zoneId} no encontrada.`);

        let updatedLocation = [...zone.location];

        updatedLocation = updatedLocation.map(div => {

          // ✅ Validar división y que tenga rows
          if (
            div.division === division &&
            Array.isArray(div.rows)
          ) {

            div.rows = div.rows.map(r => {

              // ✅ Validar fila
              if (Number(r.row) === Number(row)) {

                r.seats = r.seats.map(s =>

                  // ✅ Validar asiento
                  Number(s.id) === Number(seat)

                    ? {
                        ...s,
                        taken: action === "buy"
                      }

                    : s
                );
              }

              return r;
            });
          }

          return div;
        });

        await Zone.update(
          { location: updatedLocation },
          { where: { id: zoneId } }
        );
      }

      /**
       * =====================================================
       * 🏟️ TRIBUNAS GENERALES (ZONE)
       * =====================================================
       */
      else if (division === "Tribunas Generales") {

        const zone = await Zone.findByPk(zoneId);

        if (!zone)
          throw new Error(`Zone ${zoneId} no encontrada.`);

        let updatedLocation = [...zone.location];

        updatedLocation = updatedLocation.map(div =>

          div.division === division &&
          !Array.isArray(div.rows)

            ? {
                ...div,
                occupied:
                  action === "buy"
                    ? div.occupied + 1
                    : Math.max(0, div.occupied - 1),
              }

            : div
        );

        await Zone.update(
          { location: updatedLocation },
          { where: { id: zoneId } }
        );
      }

      /**
       * =====================================================
       * 🎫 GENERAL ZONE
       * =====================================================
       */
      else {

        const generalZone = await GeneralZone.findByPk(zoneId);

        if (!generalZone)
          throw new Error(`GeneralZone ${zoneId} no encontrada.`);

        let updatedLocation = [...generalZone.location];

        updatedLocation = updatedLocation.map(div =>

          div.division === division

            ? {
                ...div,
                occupied:
                  action === "buy"
                    ? div.occupied + 1
                    : Math.max(0, div.occupied - 1),
              }

            : div
        );

        await GeneralZone.update(
          { location: updatedLocation },
          { where: { id: zoneId } }
        );
      }

      /**
       * =====================================================
       * 🗑️ ELIMINAR TICKET
       * =====================================================
       */
      if (action === "kill") {

        await Ticket.destroy({
          where: { id: ticketId }
        });

        console.log(
          `🗑️ Ticket con ID ${ticketId} eliminado correctamente.`
        );
      }
    }

    return {

      message:

        action === "buy"

          ? "Ocupación actualizada correctamente."

          : "Liberación de asientos/lugares completada.",
    };

  } catch (error) {

    console.error("Error en seatManager:", error.message);

    throw new Error(error.message);
  }
};