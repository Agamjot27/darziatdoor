const prisma = require("../config/db");
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
        
        // check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "user"
            }
        });
        
        res.status(201).json({ message: "User registered", user });
    }
    catch (error) {
        console.error("Registration error:", error);
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
        
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        
        // generate token (Prisma uses user.id which is an integer)
        const token = jwt.sign(
            { id: user.id, role: user.role },
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
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, name: true, email: true, role: true,
                tailorProfile: {
                    select: { id: true, skills: true, experience: true, availability: true, isOnline: true }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, skills, experience } = req.body;
        const updateData = {};
        if (name && name.trim()) updateData.name = name.trim();

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true }
        });

        // If tailor, update skills/experience too
        if (req.user.role === "tailor") {
            const tailorData = {};
            if (skills) tailorData.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim()).filter(Boolean);
            if (experience !== undefined && experience !== "") tailorData.experience = parseFloat(experience);

            if (Object.keys(tailorData).length > 0) {
                await prisma.tailor.upsert({
                    where: { userId: req.user.id },
                    update: tailorData,
                    create: { userId: req.user.id, isOnline: false, latitude: 0, longitude: 0, skills: tailorData.skills || [], experience: tailorData.experience }
                });
            }
        }

        res.json({ message: "Profile updated", user });
    } catch (error) {
        console.error("Update profile error:", error);
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

exports.updateTailorStatus = async (req, res) => {
    try {
        const { isOnline, location } = req.body;
        const updateData = {};
        
        if (isOnline !== undefined) updateData.isOnline = isOnline;
        if (location && location.coordinates) {
            // MongoDB coordinates are [longitude, latitude]
            updateData.longitude = parseFloat(location.coordinates[0]);
            updateData.latitude = parseFloat(location.coordinates[1]);
        }
        
        // Prisma upsert allows inserting if it doesn't exist or updating if it does
        const tailor = await prisma.tailor.upsert({
            where: { userId: req.user.id },
            update: updateData,
            create: {
                userId: req.user.id,
                isOnline: isOnline !== undefined ? isOnline : false,
                longitude: location && location.coordinates ? parseFloat(location.coordinates[0]) : 0.0,
                latitude: location && location.coordinates ? parseFloat(location.coordinates[1]) : 0.0,
                skills: []
            }
        });
        
        res.json(tailor);
    } catch (error) {
        console.error("Update tailor status error:", error);
        res.status(500).json({ error: error.message });
    }
};


