const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
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
        const { email, password } = req.body;
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
        res.status(200).json({ message: "User logged in", user, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}