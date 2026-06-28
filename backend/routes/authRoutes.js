const express = require("express");
const router = express.Router();
const { register, Login, logout, updateTailorStatus, getMe, updateProfile } = require("../controllers/authControllers");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", Login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
router.put("/tailor/status", verifyToken, updateTailorStatus);
router.put("/profile", verifyToken, updateProfile);
module.exports = router;