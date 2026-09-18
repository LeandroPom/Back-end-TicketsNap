//src/routes/ticket.routes.js
const { Router } = require('express');
const ticketRouter = Router();

const getAllTickets = require('../handlers/ticket/getAllTicketsHandler');
const getTicketById = require('../handlers/ticket/getTicketByIdHandler');
const salesTicket = require('../handlers/ticket/salesTicketHandler');
const bulkCancelTicket = require('../handlers/ticket/bulkCancelTicketHandler');

const useQR = require('../controllers/ticket/useQR');
const offQR = require('../controllers/ticket/offQR');

const gift = require('../handlers/ticket/giftTicketHandler');
const getRegistry = require("../handlers/registry/getRegistryHandler");


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
ticketRouter.delete('/cancel/:ticketId',auth, admin, bulkCancelTicket);
ticketRouter.post('/registry',auth, admin, getRegistry)

// IMPORTANT:
// Dynamic routes like "/:id" must always go at the end
ticketRouter.get('/:id', getTicketById);

module.exports = ticketRouter;
