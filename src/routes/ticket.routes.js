const { Router } = require('express');
const ticketRouter = Router();
const sellTicket = require('../handlers/ticket/sellTicketHandler');
const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');
const cancelTicket = require('../handlers/ticket/cancelTicketHandler');

ticketRouter.get('/', getAllTickets);
ticketRouter.post('/sell', sellTicket);
ticketRouter.delete('/cancel/:ticketId', cancelTicket);

module.exports = ticketRouter;