const prisma = require("../config/db");

// GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const [totalOrders, totalUsers, totalTailors, totalRevenue, recentOrders] = await Promise.all([
            prisma.order.count(),
            prisma.user.count({ where: { role: "user" } }),
            prisma.tailor.count(),
            prisma.order.aggregate({ _sum: { price: true }, where: { status: "completed" } }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { name: true, email: true } },
                    tailor: { include: { user: { select: { name: true } } } }
                }
            })
        ]);

        const ordersByStatus = await prisma.order.groupBy({
            by: ["status"],
            _count: { status: true }
        });

        res.json({
            totalOrders,
            totalUsers,
            totalTailors,
            totalRevenue: totalRevenue._sum.price || 0,
            ordersByStatus,
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true, name: true, email: true, role: true, createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/admin/tailors
exports.getAllTailors = async (req, res) => {
    try {
        const tailors = await prisma.tailor.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                _count: { select: { orders: true, reviews: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        // Compute avg rating per tailor
        const tailorsWithRatings = await Promise.all(tailors.map(async (t) => {
            const avg = await prisma.review.aggregate({
                where: { tailorId: t.id },
                _avg: { rating: true }
            });
            return { ...t, averageRating: avg._avg.rating ? parseFloat(avg._avg.rating.toFixed(1)) : null };
        }));
        res.json({ tailors: tailorsWithRatings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/admin/orders/:id — admin force-update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const parsedId = parseInt(req.params.id);
        if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid order ID" });

        const validStatuses = ["pending", "accepted", "in_progress", "completed", "rejected"];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

        const order = await prisma.order.update({
            where: { id: parsedId },
            data: { status },
            include: {
                user: { select: { name: true, email: true } },
                tailor: { include: { user: { select: { name: true } } } }
            }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
        await prisma.user.delete({ where: { id } });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
