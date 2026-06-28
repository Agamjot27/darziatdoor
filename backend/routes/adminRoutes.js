const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { getStats, getAllUsers, getAllTailors, updateOrderStatus, deleteUser } = require("../controllers/adminControllers");

router.get("/stats", verifyToken, isAdmin, getStats);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/tailors", verifyToken, isAdmin, getAllTailors);
router.put("/orders/:id", verifyToken, isAdmin, updateOrderStatus);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
