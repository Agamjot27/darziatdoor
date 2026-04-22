const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { isTailor, isAdmin } = require("../middleware/roleMiddleware");

const {
    createOrder,
    getMyOrders,
    getTailorOrders,
    acceptOrder,
    completeOrder,
    rejectOrder,
    getOrderById,
    findNearbyTailors,
    getPendingOrders,
    getAllOrders,
    assignTailor
} = require("../controllers/orderControllers");

// ─── STATIC ROUTES FIRST (must come before /:id) ───
router.get("/nearby", verifyToken, findNearbyTailors);
router.get("/tailor", verifyToken, isTailor, getTailorOrders);
router.get("/pending", verifyToken, isTailor, getPendingOrders);
router.get("/all", verifyToken, isAdmin, getAllOrders);

// ─── BASE ROUTES ───
router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getMyOrders);

// ─── PARAMETERIZED ROUTES (must come AFTER static routes) ───
router.get("/:id", verifyToken, getOrderById);
router.put("/accept/:id", verifyToken, isTailor, acceptOrder);
router.put("/complete/:id", verifyToken, completeOrder);
router.put("/reject/:id", verifyToken, isTailor, rejectOrder);
router.put("/assign/:id", verifyToken, isAdmin, assignTailor);

module.exports = router;  