const express = require("express");
const router = express.Router();
const { register, Login, logout, updateTailorStatus } = require("../controllers/authControllers");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", Login);
router.post("/logout", logout);
router.put("/tailor/status", verifyToken, updateTailorStatus);
module.exports = router;