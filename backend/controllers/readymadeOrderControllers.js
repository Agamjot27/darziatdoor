const prisma = require("../config/db");
const { getIO } = require("../utils/socket");

const orderInclude = { tailor: { include: { user: { select: { name: true, email: true } } } } };
const validStatuses = ["placed", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];

exports.placeReadymadeOrder = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const deliveryAddress = req.body.deliveryAddress || req.body.address;
    if (!deliveryAddress) return res.status(400).json({ message: "Delivery address is required" });

    const total = cart.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.readymadeOrder.create({
        data: {
          userId: req.user.id,
          tailorId: cart.tailorId,
          items: cart.items,
          total,
          deliveryAddress,
          paymentStatus: "pending",
        },
        include: orderInclude,
      });
      await tx.cart.delete({ where: { userId: req.user.id } });
      return created;
    });

    const io = getIO();
    if (io) io.to(String(order.tailor.userId)).emit("readymade_order_updated", order);
    res.status(201).json({ message: "Readymade order placed", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReadymadeOrders = async (req, res) => {
  try {
    const where = req.user.role === "tailor"
      ? { tailor: { userId: req.user.id } }
      : { userId: req.user.id };
    const orders = await prisma.readymadeOrder.findMany({ where, include: orderInclude, orderBy: { createdAt: "desc" } });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReadymadeOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });
    const order = await prisma.readymadeOrder.findUnique({ where: { id }, include: orderInclude });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (req.user.role === "user" && order.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (req.user.role === "tailor" && order.tailor.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReadymadeStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const existing = await prisma.readymadeOrder.findUnique({ where: { id }, include: { tailor: true } });
    if (!existing) return res.status(404).json({ message: "Order not found" });
    if (req.user.role === "tailor" && existing.tailor.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const order = await prisma.readymadeOrder.update({ where: { id }, data: { status }, include: orderInclude });
    const io = getIO();
    if (io) io.to(String(order.userId)).emit("readymade_order_updated", order);
    res.json({ message: "Readymade order updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
