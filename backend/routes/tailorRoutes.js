const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { isTailor } = require("../middleware/roleMiddleware");
const { getNearbyTailors, getTailorById, updateTailorProfile, getTailorProducts } = require("../controllers/tailorControllers");

router.get("/nearby", verifyToken, getNearbyTailors);
router.get("/:id/products", getTailorProducts);
router.get("/:id", getTailorById);
router.put("/:id/profile", verifyToken, isTailor, updateTailorProfile);

module.exports = router;
