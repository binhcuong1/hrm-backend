const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // dạng "Bearer <token>"

    if (!token) return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // chứa id user
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

module.exports = verifyToken;