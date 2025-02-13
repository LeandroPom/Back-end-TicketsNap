const { Router } = require('express');
const ticketRouter = Router();
const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');
const buyTicketHandler = require('../handlers/ticket/buyTicketHandler');
const sellTicket = require('../handlers/ticket/sellTicketHandler');
const sellGeneralTicket = require('../handlers/ticket/sellGeneralTicketHandler');
const cancelTicket = require('../handlers/ticket/cancelTicketHandler');
const useQR = require('../controllers/ticket/useQR');


ticketRouter.get('/', getAllTickets);
ticketRouter.post('/buy', buyTicketHandler); // Ruta para iniciar el pago
ticketRouter.post('/sell', sellTicket);
ticketRouter.post('/sell/general', sellGeneralTicket);
ticketRouter.delete('/cancel/:ticketId', cancelTicket);
ticketRouter.get('/useQR/:id', useQR);



module.exports = ticketRouter;