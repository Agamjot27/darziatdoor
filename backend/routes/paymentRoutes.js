const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { confirmPayment, createStitchingPayment, createReadymadePayment, razorpayWebhook } = require("../controllers/paymentControllers");

router.post("/confirm", verifyToken, confirmPayment);
router.post("/stitching/:id", verifyToken, createStitchingPayment);
router.post("/readymade/:id", verifyToken, createReadymadePayment);
router.post("/webhook", razorpayWebhook);

module.exports = router;
