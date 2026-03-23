require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
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