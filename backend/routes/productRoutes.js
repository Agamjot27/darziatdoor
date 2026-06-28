const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { isTailor } = require("../middleware/roleMiddleware");
const { createProduct, updateProduct, deleteProduct } = require("../controllers/productControllers");

router.post("/", verifyToken, isTailor, createProduct);
router.put("/:id", verifyToken, isTailor, updateProduct);
router.delete("/:id", verifyToken, isTailor, deleteProduct);

module.exports = router;
