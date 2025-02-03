const { Router } = require('express');
const ticketRouter = Router();
const sellTicket = require('../handlers/ticket/sellTicketHandler');
const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');
const cancelTicket = require('../handlers/ticket/cancelTicketHandler');
const buyTicketHandler = require('../handlers/ticket/buyTicketHandler');



ticketRouter.get('/', getAllTickets);
ticketRouter.post('/sell', sellTicket);
ticketRouter.delete('/cancel/:ticketId', cancelTicket);
ticketRouter.post('/buy', buyTicketHandler); // Ruta para iniciar el pago


module.exports = ticketRouter;