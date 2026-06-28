const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { placeReadymadeOrder, getReadymadeOrders, getReadymadeOrder, updateReadymadeStatus } = require("../controllers/readymadeOrderControllers");

router.post("/readymade", verifyToken, placeReadymadeOrder);
router.get("/readymade", verifyToken, getReadymadeOrders);
router.get("/readymade/:id", verifyToken, getReadymadeOrder);
router.patch("/readymade/:id/status", verifyToken, updateReadymadeStatus);

module.exports = router;
