const jwt = require("jsonwebtoken");
exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
};