const prisma = require("../config/db");
const { getIO } = require("../utils/socket");

// GET /api/messages/:orderId — fetch chat history
exports.getMessages = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

        // Verify user has access to this order
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { tailor: { select: { userId: true } } }
        });
        if (!order) return res.status(404).json({ message: "Order not found" });
        const isClient = order.userId === req.user.id;
        const isTailor = order.tailor?.userId === req.user.id;
        if (!isClient && !isTailor && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const messages = await prisma.message.findMany({
            where: { orderId },
            include: { sender: { select: { id: true, name: true, role: true } } },
            orderBy: { createdAt: "asc" }
        });

        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/messages/:orderId — send a message
exports.sendMessage = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const { text } = req.body;
        if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });
        if (!text?.trim()) return res.status(400).json({ message: "Message text is required" });

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { tailor: { select: { userId: true } } }
        });
        if (!order) return res.status(404).json({ message: "Order not found" });
        const isClient = order.userId === req.user.id;
        const isTailor = order.tailor?.userId === req.user.id;
        if (!isClient && !isTailor && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const message = await prisma.message.create({
            data: { orderId, senderId: req.user.id, text: text.trim() },
            include: { sender: { select: { id: true, name: true, role: true } } }
        });

        // Emit to both parties via socket
        const io = getIO();
        if (io) {
            // Emit to client's room
            io.to(String(order.userId)).emit("new_message", message);
            // Emit to tailor's room if assigned
            if (order.tailor?.userId) {
                io.to(String(order.tailor.userId)).emit("new_message", message);
            }
        }

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
