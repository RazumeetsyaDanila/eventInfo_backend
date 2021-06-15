const Router = require("express");
const router = new Router();
const managerController = require("../controllers/managerController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/tariffadd", checkRole("MANAGER"), managerController.tariffadd);
router.post("/assignment", managerController.assignment);
router.post(
    "/registration",
    checkRole("MANAGER"),
    managerController.registration
);
router.get("/unprocessedpursh", managerController.unprocessedpursh);
router.post(
    "/completepurchase",
    checkRole("MANAGER"),
    managerController.completepurchase
);
router.get("/purchases", checkRole("MANAGER"), managerController.purchases);
router.get("/requisite", checkRole("MANAGER"), managerController.requisite);
router.get("/report", checkRole("MANAGER"));
router.get("/workers", managerController.workers);
router.get(
    "/upcomingworks",
    checkRole("MANAGER"),
    managerController.upcomingworks
);
router.post(
    "/completeworks",
    checkRole("MANAGER"),
    managerController.completeworks
);

module.exports = router;
