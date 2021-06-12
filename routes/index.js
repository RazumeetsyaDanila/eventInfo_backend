const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const workerRouter = require('./workerRouter');
const managerRouter = require('./managerRouter');
const operatorRouter = require('./operatorRouter');


router.use('/user', userRouter);
router.use('/worker', workerRouter);
router.use('/manager', managerRouter);
router.use('/operator', operatorRouter);

module.exports = router;