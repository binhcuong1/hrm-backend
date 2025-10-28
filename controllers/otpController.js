// controllers/otpController.js
const axios = require("axios");
require("dotenv").config();

const otpStore = {}; // Lưu OTP tạm trong RAM
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// 🔹 Hàm tạo mã OTP 6 số
function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// 📨 Gửi OTP khi chuẩn bị xóa nhân viên
exports.sendDeleteOtp = async (req, res) => {
  try {
    const empId = req.params.id;
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Lưu OTP tạm 5 phút
    otpStore[empId] = { code, exp: Date.now() + 5 * 60 * 1000 };

    // ✅ Luôn gửi tới số admin, không gửi theo ID nhân viên
    const phoneTo = process.env.ADMIN_PHONE;
    const text = `Mã OTP để xóa nhân viên ${empId} là ${code}. Hết hạn sau 5 phút.`;

    const params = new URLSearchParams();
    params.set("mocean-to", phoneTo);
    params.set("mocean-from", process.env.MOCEAN_FROM || "moceantest");
    params.set("mocean-text", text);

    console.log("📤 Gửi OTP:", params.toString());
    console.log("🔑 Dùng Bearer:", process.env.MOCEAN_BEARER);

    // ✅ Gửi bằng Bearer token cũ của m
    const resp = await axios.post("https://rest.moceanapi.com/rest/2/sms", params.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.MOCEAN_BEARER}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 15000,
    });

    if (resp.status >= 200 && resp.status < 300) {
      console.log("✅ Mocean gửi thành công:", resp.data);
      return res.json({ ok: true, message: "Đã gửi OTP đến số admin" });
    } else {
      console.error("⚠️ Mocean trả lỗi:", resp.data);
      return res.status(502).json({ ok: false, error: "mocean_error", detail: resp.data });
    }
  } catch (err) {
    console.error("❌ Lỗi gửi OTP:", err.response?.data || err.message);
    return res.status(500).json({ ok: false, error: err.response?.data || err.message });
  }
};


// ✅ Xác minh OTP và xóa nhân viên
exports.verifyDeleteOtp = async (req, res) => {
  try {
    const empId = req.params.id;
    const { code } = req.body;
    const rec = otpStore[empId];

    if (!rec)
      return res.status(400).json({ ok: false, message: "OTP không tồn tại hoặc đã hết hạn" });

    if (Date.now() > rec.exp) {
      delete otpStore[empId];
      return res.status(400).json({ ok: false, message: "OTP đã hết hạn" });
    }

    if (code !== rec.code)
      return res.status(400).json({ ok: false, message: "OTP sai" });

    // ✅ OTP đúng → xóa nhân viên trong DB (chưa gắn DB)
    delete otpStore[empId];
    return res.json({ ok: true, message: `Đã xác thực OTP. Nhân viên ${empId} đã bị xóa.` });
  } catch (err) {
    console.error("❌ Lỗi verify OTP:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
