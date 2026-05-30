const { Router } = require('express');
const ticketRouter = Router();

const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');
const getTicketById = require('../handlers/ticket/getTicketByIdHandler');
const salesTicket = require('../handlers/ticket/salesTicketHandler');
const cancelTicket = require('../handlers/ticket/cancelTicketHandler');
const cancelGeneralTicket = require('../handlers/ticket/cancelGeneralTicketHandler');

const useQR = require('../controllers/ticket/useQR');
const offQR = require('../controllers/ticket/offQR');

const gift = require('../handlers/ticket/giftTicketHandler');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const cashier = require('../middlewares/cashier');

// User
ticketRouter.get('/', getAllTickets);
ticketRouter.post('/sales', auth, salesTicket);

// Cashier
ticketRouter.get('/useQR/:id', auth, cashier, useQR);
ticketRouter.put('/offQR/:id', auth, cashier, offQR);

// Admin
ticketRouter.get('/gift/:id',auth, admin, gift);
ticketRouter.delete('/cancel/:ticketId',auth, admin, cancelTicket);
ticketRouter.delete('/cancel/general/:ticketId',auth, admin, cancelGeneralTicket);

// IMPORTANT:
// Dynamic routes like "/:id" must always go at the end
ticketRouter.get('/:id', getTicketById);

module.exports = ticketRouter;