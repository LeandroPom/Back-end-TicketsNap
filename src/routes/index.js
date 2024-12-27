const { Router } = require('express');
const userRouter = require('./user.routes');
const showRouter = require('./show.routes');
const tagRouter = require('./tag.routes');
const placeRouter = require('./place.routes');
const zoneRouter = require('./zone.routes');
const analiticsRouter = require('./analitics.routes');
const templateRouter = require('./template.routes');



const router = Router();


router.use((req, res, next) => {
    console.log(`Solicitud a la ruta: ${req.url}`);
    next();
});


router.use('/analitics', analiticsRouter);
router.use('/users', userRouter);
router.use('/shows', showRouter);
router.use('/tags', tagRouter);
router.use('/places', placeRouter);
router.use('/zones', zoneRouter);
router.use('/templates', templateRouter);


module.exports = router;
