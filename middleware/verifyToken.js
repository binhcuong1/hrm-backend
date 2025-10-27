const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  console.log("📩 Header Authorization:", authHeader);

  if (!authHeader)
    return res.status(401).json({ message: "Thiếu header Authorization" });

  // Cắt "Bearer " ra an toàn
  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];

  console.log("🔹 Token nhận được từ client:", token);

  if (!token)
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token hợp lệ:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT Verify Error:", err.name, "-", err.message);
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = verifyToken;
