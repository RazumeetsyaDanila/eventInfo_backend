const Router = require('express');
const router = new Router();
const workerController = require('../controllers/workerController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/requisiteadd', checkRole("WORKER"), workerController.requisiteadd);
router.post('/purshasecreate', checkRole("WORKER"), workerController.purshasecreate);
router.post('/requisite', checkRole("WORKER"), workerController.requisite);
router.post('/completeorder', checkRole("WORKER"), workerController.completeorder);
router.post('/upcomingworks', checkRole("WORKER"), workerController.upcomingworks);
router.get('/purchases', checkRole("WORKER"), workerController.purchases);

module.exports = router;