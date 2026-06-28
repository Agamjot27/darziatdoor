const prisma = require("../config/db");

const normalizeItems = (items) => Array.isArray(items) ? items : [];

exports.getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { tailor: { include: { user: { select: { name: true } } } } },
    });
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const productId = parseInt(req.body.productId, 10);
    const quantity = Math.max(1, parseInt(req.body.quantity || 1, 10));
    if (Number.isNaN(productId)) return res.status(400).json({ message: "Valid productId is required" });

    const product = await prisma.product.findUnique({ where: { id: productId }, include: { tailor: { include: { user: { select: { name: true } } } } } });
    if (!product || !product.isActive || product.stock < 1) return res.status(404).json({ message: "Product unavailable" });

    const existing = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (existing && existing.tailorId !== product.tailorId && !req.body.replaceCart) {
      return res.status(409).json({
        message: "Your cart already has items from another tailor",
        conflict: true,
        existingTailorId: existing.tailorId,
        incomingTailorId: product.tailorId,
      });
    }

    let items = existing && existing.tailorId === product.tailorId ? normalizeItems(existing.items) : [];
    const current = items.find((item) => item.productId === product.id);
    if (current) current.quantity = Math.min(product.stock, current.quantity + quantity);
    else items.push({ productId: product.id, name: product.name, quantity: Math.min(product.stock, quantity), price: product.price, image: product.images?.[0] || null });

    const cart = await prisma.cart.upsert({
      where: { userId: req.user.id },
      update: { tailorId: product.tailorId, items },
      create: { userId: req.user.id, tailorId: product.tailorId, items },
      include: { tailor: { include: { user: { select: { name: true } } } } },
    });
    res.json({ message: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const quantity = Math.max(0, parseInt(req.body.quantity || 0, 10));
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    const items = normalizeItems(cart.items).map((item) => item.productId === productId ? { ...item, quantity } : item).filter((item) => item.quantity > 0);
    if (!items.length) {
      await prisma.cart.delete({ where: { userId: req.user.id } });
      return res.json({ message: "Cart cleared", cart: null });
    }
    const updated = await prisma.cart.update({ where: { userId: req.user.id }, data: { items } });
    res.json({ message: "Cart updated", cart: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  req.body.quantity = 0;
  return exports.updateCartItem(req, res);
};

exports.clearCart = async (req, res) => {
  try {
    await prisma.cart.deleteMany({ where: { userId: req.user.id } });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
