const Router = require('express');
const router = new Router();
const managerController = require('../controllers/managerController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/tariffadd', checkRole("MANAGER"), managerController.tariffadd);
router.post('/assignment', checkRole("MANAGER"), managerController.assignment);
router.post('/registration', checkRole("MANAGER"), managerController.registration);
router.get('/unprocessedpursh', checkRole("MANAGER"), managerController.unprocessedpursh);
router.get('/purchases', checkRole("MANAGER"), managerController.purchases);
router.get('/requisite', checkRole("MANAGER"), managerController.requisite);
router.get('/report', checkRole("MANAGER"), );
router.get('/workers', checkRole("MANAGER"), managerController.workers);
router.post('/works', checkRole("MANAGER"), managerController.works);

module.exports = router;