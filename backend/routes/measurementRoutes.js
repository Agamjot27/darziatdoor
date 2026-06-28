const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { listMeasurements, createMeasurement, updateMeasurement } = require("../controllers/measurementControllers");

router.get("/", verifyToken, listMeasurements);
router.post("/", verifyToken, createMeasurement);
router.put("/:id", verifyToken, updateMeasurement);

module.exports = router;
