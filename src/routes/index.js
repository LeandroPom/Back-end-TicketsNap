const { Router } = require('express');
const userRouter = require('./user.routes');
const tagRouter = require('./tag.routes');



const router = Router();


router.use((req, res, next) => {
    console.log(`Solicitud a la ruta: ${req.url}`);
    next();
});


router.use('/users', userRouter);
router.use('/tags', tagRouter);


module.exports = router;
