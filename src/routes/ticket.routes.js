const { Router } = require('express');
const ticketRouter = Router();
const sellTicket = require('../handlers/ticket/sellTicketHandler');
const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');

ticketRouter.get('/', getAllTickets);
ticketRouter.post('/sell', sellTicket);

module.exports = ticketRouter;