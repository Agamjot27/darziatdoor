require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const prisma = require("./config/db");

const app = express();

// Security Middleware
app.use(helmet());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api/", apiLimiter);

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean);
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// DB connection
prisma.$connect()
    .then(() => console.log("PostgreSQL (Prisma) connected successfully"))
    .catch((err) => console.error("Database connection error:", err));

// Create HTTP server
const http = require("http");
const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

const { setIO } = require("./utils/socket");
setIO(io);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (userId) => {
        socket.join(String(userId));
        console.log(`User ${userId} joined their private room.`);
    });

    socket.on("update_location", async (data) => {
        try {
            const { role, userId, lat, lng } = data;
            if (!userId || lat == null || lng == null) return;

            const parsedUserId = parseInt(userId);
            const parsedLat = parseFloat(lat);
            const parsedLng = parseFloat(lng);
            const { emitTailorLocation } = require("./utils/socket");

            if (role === "tailor") {
                const tailor = await prisma.tailor.findUnique({ where: { userId: parsedUserId } });
                if (!tailor) return;

                await prisma.tailor.update({
                    where: { id: tailor.id },
                    data: { latitude: parsedLat, longitude: parsedLng },
                });

                const activeOrders = await prisma.order.findMany({
                    where: {
                        tailorId: tailor.id,
                        status: { in: ["accepted", "in_progress"] },
                    },
                    include: { tailor: { include: { user: { select: { name: true } } } } },
                });

                for (const order of activeOrders) {
                    emitTailorLocation(order.userId, {
                        orderId: order.id,
                        lat: parsedLat,
                        lng: parsedLng,
                        tailorName: order.tailor?.user?.name || "Your tailor",
                    });
                }
            } else {
                await prisma.user.update({
                    where: { id: parsedUserId },
                    data: { latitude: parsedLat, longitude: parsedLng },
                });
            }
        } catch (err) {
            console.error("Location update error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Server start
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/test-user", async (req, res) => {
    const user = await prisma.user.create({
        data: {
            name: "test",
            email: `test_${Date.now()}@test.com`,
            password: "123456",
        }
    });

    res.json(user);
});

const { verifyToken } = require("./middleware/authMiddleware");
app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Protected route", user: req.user });
});

const readymadeOrderRoutes = require("./routes/readymadeOrderRoutes");
app.use("/api/orders", readymadeOrderRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const tailorRoutes = require("./routes/tailorRoutes");
app.use("/api/tailors", tailorRoutes);

const measurementRoutes = require("./routes/measurementRoutes");
app.use("/api/measurements", measurementRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);
