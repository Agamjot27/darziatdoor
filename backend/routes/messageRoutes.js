const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { getMessages, sendMessage } = require("../controllers/messageControllers");

router.get("/:orderId", verifyToken, getMessages);
router.post("/:orderId", verifyToken, sendMessage);

module.exports = router;
