const { Router } = require('express');
const userRouter = require('./user.routes');
const showRouter = require('./show.routes');
const tagRouter = require('./tag.routes');
const placeRouter = require('./place.routes');



const router = Router();


router.use((req, res, next) => {
    console.log(`Solicitud a la ruta: ${req.url}`);
    next();
});


router.use('/users', userRouter);
router.use('/shows', showRouter);
router.use('/tags', tagRouter);
router.use('/places', placeRouter);


module.exports = router;
