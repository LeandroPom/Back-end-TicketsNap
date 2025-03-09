const { Router } = require('express');
const ticketRouter = Router();
const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');
const buyTicketHandler = require('../handlers/ticket/buyTicketHandler');
const buyGeneralTicketHandler = require('../handlers/ticket/buyGeneralTicketsHandler');
const sellTicket = require('../handlers/ticket/sellTicketHandler');
const sellGeneralTicket = require('../handlers/ticket/sellGeneralTicketHandler');
const cancelTicket = require('../handlers/ticket/cancelTicketHandler');
const cancelGeneralTicket = require('../handlers/ticket/cancelGeneralTicketHandler');
const useQR = require('../controllers/ticket/useQR');
const gift = require('../handlers/ticket/giftTicketHandler');


ticketRouter.get('/', getAllTickets);
ticketRouter.post('/buy', buyTicketHandler); // Ruta para iniciar el pago
ticketRouter.post('/buy/general', buyGeneralTicketHandler); // Ruta para iniciar el pago
ticketRouter.post('/sell', sellTicket);
ticketRouter.post('/sell/general', sellGeneralTicket);
ticketRouter.delete('/cancel/:ticketId', cancelTicket);
ticketRouter.delete('/cancel/general/:ticketId', cancelGeneralTicket);
ticketRouter.get('/useQR/:id', useQR);
ticketRouter.get('/gift/:id',gift);



module.exports = ticketRouter;