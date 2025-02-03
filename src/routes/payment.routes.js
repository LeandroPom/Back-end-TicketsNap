const { Router } = require('express');
const mpRouter = Router();
const successPayment = require('../controllers/mercadoPago/successPayment');
const failurePayment = require('../controllers/mercadoPago/failurePayment');
const pendingPayment = require('../controllers/mercadoPago/pendingPayment');
const notificationPayment = require('../controllers/mercadoPago/notificationPayment');


mpRouter.get('/success', successPayment); 
mpRouter.get('/failure', failurePayment);
mpRouter.get('/pending', pendingPayment);
mpRouter.post('/notification', notificationPayment); // Ruta para notificación de pago


module.exports = mpRouter;