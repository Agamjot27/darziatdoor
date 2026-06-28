const crypto = require("crypto");
const Razorpay = require("razorpay");
const prisma = require("../config/db");

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

const createGatewayOrder = async ({ amount, receipt, notes }) => {
  if (!razorpay) {
    return { id: `dev_order_${Date.now()}`, amount: amount * 100, currency: "INR", receipt, notes, dev: true };
  }
  return razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt, notes });
};

exports.createStitchingPayment = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id || req.body.orderId, 10);
    if (Number.isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (!order.price) return res.status(400).json({ message: "Tailor has not quoted this booking yet" });

    const gatewayOrder = await createGatewayOrder({ amount: Math.round(order.price), receipt: `stitching_${order.id}`, notes: { type: "stitching", orderId: String(order.id) } });
    await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: gatewayOrder.id, paymentStatus: "pending" } });
    res.json({ order: gatewayOrder, keyId: process.env.RAZORPAY_KEY_ID || "dev_key", amount: Math.round(order.price) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReadymadePayment = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id || req.body.orderId, 10);
    if (Number.isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });
    const order = await prisma.readymadeOrder.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: "Readymade order not found" });
    if (order.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    const gatewayOrder = await createGatewayOrder({ amount: order.total, receipt: `readymade_${order.id}`, notes: { type: "readymade", orderId: String(order.id) } });
    await prisma.readymadeOrder.update({ where: { id: order.id }, data: { razorpayOrderId: gatewayOrder.id, paymentStatus: "pending" } });
    res.json({ order: gatewayOrder, keyId: process.env.RAZORPAY_KEY_ID || "dev_key", amount: order.total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, orderType = "stitching", paymentId } = req.body;
    const parsedId = parseInt(orderId, 10);
    if (Number.isNaN(parsedId)) return res.status(400).json({ message: "Invalid order ID" });

    if (orderType === "readymade") {
      const order = await prisma.readymadeOrder.findUnique({ where: { id: parsedId } });
      if (!order) return res.status(404).json({ message: "Readymade order not found" });
      if (order.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
      await prisma.readymadeOrder.update({ where: { id: parsedId }, data: { paymentStatus: "paid", paymentId: paymentId || "dev_confirmed" } });
      return res.json({ message: "Payment confirmed", orderId: parsedId, orderType });
    }

    const order = await prisma.order.findUnique({ where: { id: parsedId } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (!order.price) return res.status(400).json({ message: "Order has no price set yet" });
    await prisma.order.update({ where: { id: parsedId }, data: { paymentStatus: "paid" } });
    res.json({ message: "Payment confirmed", orderId: parsedId, orderType: "stitching" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(500).json({ message: "Webhook secret not configured" });
    const signature = req.headers["x-razorpay-signature"];
    const body = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (signature !== expected) return res.status(400).json({ message: "Invalid webhook signature" });

    const event = req.body;
    const payment = event.payload?.payment?.entity;
    const notes = payment?.notes || {};
    const orderId = parseInt(notes.orderId, 10);
    if (event.event === "payment.captured" && notes.type === "stitching" && !Number.isNaN(orderId)) {
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "paid" } });
    }
    if (event.event === "payment.captured" && notes.type === "readymade" && !Number.isNaN(orderId)) {
      await prisma.readymadeOrder.update({ where: { id: orderId }, data: { paymentStatus: "paid", paymentId: payment.id } });
    }
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
