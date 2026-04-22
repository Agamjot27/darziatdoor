require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

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
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

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

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their private room.`);
    });

    socket.on("update_location", (data) => {
        // data: { userId, coordinates: [lng, lat] }
        console.log("Location update received:", data);
        // In the future, we'll update the DB here
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

const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/test-user", async (req, res) => {
    const user = await User.create({
        name: "test",
        email: "test@test.com",
        password: "123456",
    });

    res.json(user);
});

const { verifyToken } = require("./middleware/authMiddleware");
app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Protected route", user: req.user });
});

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);