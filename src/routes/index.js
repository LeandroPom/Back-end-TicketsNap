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



const router = Router();


router.use((req, res, next) => {
    console.log(`Solicitud a la ruta: ${req.url}`);
    next();
});


router.use('/api/analitics', analiticsRouter);
router.use('/api/users', userRouter);
router.use('/api/shows', showRouter);
router.use('/api/tags', tagRouter);
router.use('/api/places', placeRouter);
router.use('/api/zones', zoneRouter);
router.use('/api/tickets', ticketRouter);
router.use('/api/payments', mpRouter);
router.use('/api/templates', templateRouter);
router.use('/api/banners', bannerRouter);



module.exports = router;
