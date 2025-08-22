require("dotenv").config();
const { Ticket, Show, Zone, GeneralZone } = require("../../db");
const filterZone = require("../zone/filterZone");
const payment = require("../mercadoPago/payment");
const QRCode = require("qrcode");
const sendTicketsEmail = require("../mailer/sendTicketEmail");
const seatManager = require("./seatManager");

module.exports = async (tickets = [], service) => {
  try {
    let totalPrice = 0;
    let createdTickets = [];
    let mpTicketIds = [];

    for (const ticket of tickets) {
      const {
        showId, zoneId, division, row, seatId, price,
        name, dni, mail, phone, userId,
      } = ticket;

      const show = await Show.findByPk(showId);
      if (!show) throw new Error(`Show con ID "${showId}" no encontrado.`);

      const zone = await Zone.findByPk(zoneId);
      const generalZone = await GeneralZone.findByPk(zoneId);

      let validPrice;
      let rowValue = null;
      let seatValue = null;

      // Validaciones de precio y disponibilidad
      if (row || seatId) {
        if (!zone) throw new Error(`Zona no encontrada para asiento con fila/asiento definido.`);

        const seatData = await filterZone(zoneId, division, row, seatId);
        const seatInfo = seatData?.[0];
        if (!seatInfo || seatInfo.taken)
          throw new Error(`Asiento ${seatId} ocupado o inexistente.`);

        if (zone.generalTicket) {
          const divisionData = await filterZone(zoneId, division);
          validPrice = Number(divisionData?.[0]?.generalPrice);
        } else {
          const rowData = await filterZone(zoneId, division, row);
          validPrice = Number(rowData?.[0]?.rowPrice);
        }

        if (Number(price) !== validPrice)
          throw new Error(`Precio incorrecto para asiento.`);

        rowValue = row;
        seatValue = seatId;

      } else if (zone && division === "Tribunas Generales") {
        const tribunaData = await filterZone(zoneId, division);
        const tribunaInfo = tribunaData?.[0];
        if (!tribunaInfo || tribunaInfo.occupied >= tribunaInfo.space)
          throw new Error(`Sin espacio en la división "${division}".`);

        validPrice = Number(tribunaInfo.generalPrice);
        if (Number(price) !== validPrice)
          throw new Error(`Precio inválido para la división "${division}".`);

      } else if (generalZone) {
        const divisionData = generalZone.location.find(d => d.division === division);
        if (!divisionData || divisionData.occupied >= divisionData.space)
          throw new Error(`Sin espacio en la división general "${division}".`);

        validPrice = Number(divisionData.price);
        if (Number(price) !== validPrice)
          throw new Error(`Precio inválido para zona general.`);

      }

      // Creación del ticket
      const date = new Date((zone || generalZone).presentation.date)
        .toISOString()
        .split("T")[0];
      const time = (zone || generalZone).presentation.time;
      const func = (zone || generalZone).presentation.performance;

      const ticketData = {
        userId,
        zoneId,
        showId,
        division,
        state: false,
        location: show.location,
        date: `${date} || ${time.start} - ${time.end}`,
        function: func,
        row: rowValue,
        seat: seatValue,
        price,
        name,
        dni,
        mail,
        phone,
      };

      const newTicket = await Ticket.create(ticketData);
      totalPrice += Number(price);
      mpTicketIds.push(newTicket.id);

      if (service === "CASH") {
        await Ticket.update({ state: true }, { where: { id: newTicket.id } });
        const qrUrl = `${process.env.FRONTEND_URL}/tickets/useQR/${newTicket.id}`;
        const qrCode = await QRCode.toDataURL(qrUrl);

        await Ticket.update({ qrCode }, { where: { id: newTicket.id } });

        createdTickets.push({
          ...ticketData,
          id: newTicket.id,
          qrCode,
          state: true,
          showName: show.name,
        });
      }
    }

    
    if (service === "MP") {
      const { name, mail, phone, dni, zoneId, showId } = tickets[0];
      return await payment(mpTicketIds, name, mail, phone, dni, totalPrice, zoneId, showId);
    }
    
    if (service === "CASH" && createdTickets.length > 0) {

      const ticketObjects = mpTicketIds.map(id => ({ ticketId: id }));
      
      await seatManager(ticketObjects, "buy");

      await sendTicketsEmail(createdTickets);
    }

    return createdTickets;

  } catch (error) {
    console.error("Error en salesTicketController:", error.message);
    throw new Error(error.message);
  }
};



// // controller: salesTicket.js
// require("dotenv").config();
// const { Ticket, Show, Zone, GeneralZone } = require("../../db");
// const filterZone = require("../../controllers/zone/filterZone");
// const payment = require("../mercadoPago/payment");
// const QRCode = require("qrcode");
// const sendTicketsEmail = require("../mailer/sendTicketEmail");

// module.exports = async (tickets = [], service) => {
//   try {
//     let totalPrice = 0;
//     let createdTickets = [];
//     let mpTicketIds = [];

//     for (const ticket of tickets) {
//       const {
//         showId,
//         zoneId,
//         division,
//         row,
//         seatId,
//         price,
//         name,
//         dni,
//         mail,
//         phone,
//         userId,
//       } = ticket;

//       const show = await Show.findByPk(showId);
//       if (!show) throw new Error(`Show con ID "${showId}" no encontrado.`);

//       const zone = await Zone.findByPk(zoneId);
//       const generalZone = await GeneralZone.findByPk(zoneId);

//       let updatedLocation = zone?.location ? [...zone.location] : [];
//       let validPrice;
//       let rowValue = null;
//       let seatValue = null;

//       // L贸gica r谩pida para redireccionar si hay row y seatId v谩lidos
//       if (row || seatId) {
//         if (zone) {
//           const seatData = await filterZone(zoneId, division, row, seatId);
//           const seatInfo = seatData?.[0];
//           if (!seatInfo || seatInfo.taken)
//             throw new Error(`Asiento ${seatId} ocupado o inexistente.`);

//           if (zone.generalTicket) {
//             const divisionData = await filterZone(zoneId, division);
//             validPrice = Number(divisionData?.[0]?.generalPrice);
//           } else {
//             const rowData = await filterZone(zoneId, division, row);
//             validPrice = Number(rowData?.[0]?.rowPrice);
//           }

//           if (Number(price) !== validPrice)
//             throw new Error(`Precio incorrecto para asiento.`);

//           updatedLocation = updatedLocation.map((div) => {
//             if (div.division === division) {
//               div.rows = div.rows.map((r) => {
//                 if (r.row === row) {
//                   r.seats = r.seats.map((seat) =>
//                     seat.id === seatId ? { ...seat, taken: true } : seat
//                   );
//                 }
//                 return r;
//               });
//             }
//             return div;
//           });

//           await Zone.update({ location: updatedLocation }, { where: { id: zoneId } });

//           rowValue = row;
//           seatValue = seatId;
//         } else {
//           throw new Error(`Zona no encontrada para asiento con fila/asiento definido.`);
//         }
//       } else if (zone && division === "Tribunas Generales") {
//         const tribunaData = await filterZone(zoneId, division);
//         const tribunaInfo = tribunaData?.[0];
//         if (!tribunaInfo || tribunaInfo.occupied >= tribunaInfo.space)
//           throw new Error(`Sin espacio en la divisi贸n "${division}".`);

//         validPrice = Number(tribunaInfo.generalPrice);
//         if (Number(price) !== validPrice)
//           throw new Error(`Precio inv谩lido para la divisi贸n "${division}".`);

//         updatedLocation = updatedLocation.map((div) =>
//           div.division === division ? { ...div, occupied: div.occupied + 1 } : div
//         );

//         await Zone.update({ location: updatedLocation }, { where: { id: zoneId } });

//       } else if (generalZone) {
//         const divisionData = generalZone.location.find((d) => d.division === division);
//         if (!divisionData || divisionData.occupied >= divisionData.space)
//           throw new Error(`Sin espacio en la divisi贸n general "${division}".`);

//         validPrice = Number(divisionData.price);
//         if (Number(price) !== validPrice)
//           throw new Error(`Precio inv谩lido para zona general.`);

//         const updatedLocation = generalZone.location.map((div) =>
//           div.division === division ? { ...div, occupied: div.occupied + 1 } : div
//         );

//         await GeneralZone.update({ location: updatedLocation }, { where: { id: zoneId } });

//       }

//       const date = new Date(
//         (zone || generalZone).presentation.date
//       )
//         .toISOString()
//         .split("T")[0];
//       const time = (zone || generalZone).presentation.time;
//       const func = (zone || generalZone).presentation.performance;

//       const ticketData = {
//         userId,
//         zoneId,
//         showId,
//         division,
//         state: false,
//         location: show.location,
//         date: `${date} || ${time.start} - ${time.end}`,
//         function: func,
//         row: rowValue,
//         seat: seatValue,
//         price,
//         name,
//         dni,
//         mail,
//         phone,
//       };

//       const newTicket = await Ticket.create(ticketData);
//       totalPrice += Number(price);
//       mpTicketIds.push(newTicket.id);

//       if (service === "CASH") {
//         await Ticket.update({ state: true }, { where: { id: newTicket.id } });
//         const qrUrl = `${process.env.FRONTEND_URL}/tickets/useQR/${newTicket.id}`;
//         const qrCode = await QRCode.toDataURL(qrUrl);

//         await Ticket.update({ qrCode }, { where: { id: newTicket.id } });

//         createdTickets.push({
//           ...ticketData,
//           id: newTicket.id,  // NOS ASEGURAMOS QUE TENGA EL ID.
//           qrCode,
//           state: true,
//           showName: show.name,
//         });

//       }
//     }

//     if (service === "MP") {
//       const { name, mail, phone, dni, zoneId, showId } = tickets[0];
//       return await payment(mpTicketIds, name, mail, phone, dni, totalPrice, zoneId, showId);
//     }

//         // 馃敼 Env铆o de m煤ltiples tickets si es CASH
//     if (service === "CASH" && createdTickets.length > 0) {
//       await sendTicketsEmail(createdTickets);
//     }

//     return createdTickets;
    
//   } catch (error) {
//     console.error("Error en salesTicketController:", error.message);
//     throw new Error(error.message);
//   }
// };