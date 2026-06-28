const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require("../controllers/cartControllers");

router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/item/:productId", verifyToken, updateCartItem);
router.delete("/item/:productId", verifyToken, removeCartItem);
router.delete("/", verifyToken, clearCart);

module.exports = router;
