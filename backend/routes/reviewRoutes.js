const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { createReview, getTailorReviews, getOrderReview } = require("../controllers/reviewControllers");

router.post("/", verifyToken, createReview);
router.get("/tailor/:tailorId", getTailorReviews);
router.get("/order/:orderId", verifyToken, getOrderReview);

module.exports = router;
