const prisma = require("../config/db");

// POST /api/reviews — client submits a review after order completed
exports.createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const parsedOrderId = parseInt(orderId);
        if (isNaN(parsedOrderId) || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Valid orderId and rating (1-5) are required" });
        }

        // Validate order belongs to this user and is completed
        const order = await prisma.order.findUnique({
            where: { id: parsedOrderId },
            include: { review: true }
        });
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.userId !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
        if (order.status !== "completed") return res.status(400).json({ message: "Can only review completed orders" });
        if (!order.tailorId) return res.status(400).json({ message: "No tailor assigned to this order" });
        if (order.review) return res.status(400).json({ message: "You have already reviewed this order" });

        const review = await prisma.review.create({
            data: {
                orderId: parsedOrderId,
                userId: req.user.id,
                tailorId: order.tailorId,
                rating: parseInt(rating),
                comment: comment?.trim() || null,
            },
            include: {
                user: { select: { name: true } },
                tailor: { include: { user: { select: { name: true } } } }
            }
        });

        res.status(201).json({ message: "Review submitted", review });
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/reviews/tailor/:tailorId — get all reviews for a tailor
exports.getTailorReviews = async (req, res) => {
    try {
        const tailorId = parseInt(req.params.tailorId);
        if (isNaN(tailorId)) return res.status(400).json({ message: "Invalid tailor ID" });

        const reviews = await prisma.review.findMany({
            where: { tailorId },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" }
        });

        const avg = reviews.length
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : null;

        res.json({ reviews, averageRating: avg ? parseFloat(avg.toFixed(1)) : null, total: reviews.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/reviews/order/:orderId — check if current user already reviewed
exports.getOrderReview = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

        const review = await prisma.review.findUnique({
            where: { orderId },
            include: { user: { select: { name: true } } }
        });

        res.json({ review: review || null });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
