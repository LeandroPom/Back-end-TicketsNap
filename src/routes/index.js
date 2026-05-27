const { Router } = require('express');
const userRouter = require('./user.routes');
const showRouter = require('./show.routes');
const placeRouter = require('./place.routes');
const tagRouter = require('./tag.routes');
const zoneRouter = require('./zone.routes');
const ticketRouter = require('./ticket.routes');
const mpRouter = require('./payment.routes');
const analiticsRouter = require('./analitics.routes');
const templateRouter = require('./template.routes');
const bannerRouter = require('./banner.routes');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const router = Router();

router.use((req, res, next) => {
  console.log(`Solicitud a la ruta: ${req.url}`);
  next();
});

// Public
router.use('/api/tags', tagRouter);
router.use('/api/users', userRouter);
router.use('/api/shows', showRouter);
router.use('/api/zones', zoneRouter);
router.use('/api/places', placeRouter);
router.use('/api/banners', bannerRouter);
router.use('/api/payments', mpRouter);

// Users
router.use('/api/tickets', auth, ticketRouter);

// Admin
router.use('/api/templates', auth, admin, templateRouter);
router.use('/api/analitics', auth, admin, analiticsRouter);

module.exports = router;
