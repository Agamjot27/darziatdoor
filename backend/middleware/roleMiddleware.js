exports.isTailor = (req, res, next) => {
    if (req.user.role !== "tailor") {
        return res.status(403).json({ message: "Access Denied Tailors only" });
    }
    next();
}
// ADMIN CHECK
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
};