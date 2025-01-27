console.log("you're in PaymentNotification controller")
// const { Ticket, Zone, Show } = require('../../db');
// const filterZone = require('../zone/filterZone');

// module.exports = async (paymentData) => {
//   try {
//     // **Paso 1: Validar si el pago fue aprobado**
//     const { action, data } = paymentData;

//     if (action !== 'payment.created') {
//       throw new Error('Acción inválida recibida en la notificación.');
//     }

//     // Obtener detalles del pago
//     const paymentStatus = data.status;
//     const externalReference = data.external_reference; // Aquí pasamos el ticketId

//     if (paymentStatus !== 'approved') {
//       throw new Error('El pago no fue aprobado.');
//     }

//     // **Paso 2: Verificar si el ticket ya fue creado**
//     const existingTicket = await Ticket.findByPk(externalReference);
//     if (existingTicket && existingTicket.state === true) {
//       console.log(`El ticket con ID ${externalReference} ya fue activado.`);
//       return;
//     }

//     // **Paso 3: Recuperar datos del ticket**
//     const ticket = await Ticket.findByPk(externalReference);
//     if (!ticket) {
//       throw new Error(`No se encontró el ticket con ID ${externalReference}.`);
//     }

//     const { zoneId, division, row, seat } = ticket;

//     // **Paso 4: Marcar asiento como ocupado**
//     const zone = await Zone.findByPk(zoneId);
//     if (!zone) throw new Error(`No se encontró la zona con ID ${zoneId}.`);

//     let updatedLocation;

//     if (division === 'Tribunas Generales') {
//       // Incrementar espacio ocupado
//       updatedLocation = zone.location.map(div => {
//         if (div.division === division) {
//           if (div.occupied >= div.space) {
//             throw new Error(`Todos los espacios en "${division}" ya están ocupados.`);
//           }
//           return { ...div, occupied: div.occupied + 1 };
//         }
//         return div;
//       });
//     } else {
//       // Marcar asiento como ocupado
//       updatedLocation = zone.location.map(div => {
//         if (div.division === division) {
//           div.rows = div.rows.map(r => {
//             if (r.row === row) {
//               r.seats = r.seats.map(s => {
//                 if (s.id === seat) {
//                   return { ...s, taken: true };
//                 }
//                 return s;
//               });
//             }
//             return r;
//           });
//         }
//         return div;
//       });
//     }

//     // **Paso 5: Actualizar la zona en la base de datos**
//     await Zone.update(
//       { location: updatedLocation },
//       { where: { id: zoneId } }
//     );

//     // **Paso 6: Activar el ticket**
//     await Ticket.update({ state: true }, { where: { id: ticket.id } });

//     console.log(`Ticket con ID ${ticket.id} activado correctamente.`);

//   } catch (error) {
//     console.error(`Error en paymentNotificationController: ${error.message}`);
//     throw new Error(error.message);
//   }
// };

