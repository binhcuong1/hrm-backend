const pool = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Đăng nhập admin duy nhất
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    try {
        console.log("📩 Nhận request login:", email);

        // ✅ Query bằng async/await vì pool là promise-based
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            console.warn("⚠️ Email không tồn tại:", email);
            return res.status(401).json({ message: "Email không tồn tại" });
        }

        const admin = rows[0];

        // ✅ So sánh mật khẩu
        if (password !== admin.password) {
            console.warn("⚠️ Sai mật khẩu cho:", email);
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        console.log(`✅ Admin ${admin.name} đăng nhập thành công`);

        // ✅ Tạo JWT Token (hết hạn 1 giờ)
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || "supersecretkey",
            { expiresIn: "1h" }
        );

        // ✅ Trả response kèm token
        return res.json({
            message: "Đăng nhập thành công",
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
            accessToken: token,
        });

    } catch (err) {
        console.error("❌ Lỗi trong login:", err.message);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
