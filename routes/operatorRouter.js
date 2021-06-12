const Router = require('express');
const router = new Router();
const operatorController = require('../controllers/operatorController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/clientadd', checkRole("OPERATOR"), operatorController.clientadd);
router.post('/orderadd', checkRole("OPERATOR"), operatorController.orderadd);
router.get('/calculation', checkRole("OPERATOR"), );

module.exports = router;