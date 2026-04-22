const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "tailor"]).optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

exports.register = async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
             return res.status(400).json({ message: validation.error.issues[0].message });
        }
        const { name, email, password, role } = validation.data;
        //check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: "User registered", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
exports.Login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
             return res.status(400).json({ message: validation.error.issues[0].message });
        }
        const { email, password } = validation.data;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        //generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({ message: "User logged in", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', '', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0 
    });
    res.status(200).json({ message: "User logged out" });
};

const Tailor = require("../models/Tailor");
exports.updateTailorStatus = async (req, res) => {
    try {
        const { isOnline, location } = req.body;
        const updateData = {};
        if (isOnline !== undefined) updateData.isOnline = isOnline;
        if (location) updateData.location = location;
        
        const tailor = await Tailor.findOneAndUpdate(
            { userId: req.user.id },
            updateData,
            { new: true, upsert: true }
        );
        res.json(tailor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};