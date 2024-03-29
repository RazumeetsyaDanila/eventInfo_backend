const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/orders", userController.orders);
router.get("/tariffs", authMiddleware, userController.tariffs);
router.get("/clients", authMiddleware, userController.clients);

module.exports = router;
