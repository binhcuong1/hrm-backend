const axios = require("axios");
require("dotenv").config();

const otpStore = {}; // Lưu OTP tạm trong RAM
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// 🔹 Hàm tạo mã OTP 6 số
function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ============================================================
// 📨 GỬI OTP CHO ADMIN ĐỂ XÁC NHẬN XÓA NHÂN VIÊN
exports.sendOtpForDelete = async (req, res) => {
  try {
    const adminId = req.params.adminId; // luôn là 1 từ Flutter
    const { targetId } = req.body; // nhân viên cần xóa

    const code = genCode();

    // Lưu OTP vào RAM trong 5 phút
    otpStore[targetId] = { code, exp: Date.now() + 5 * 60 * 1000 };

    // ✅ Gửi OTP đến admin (fix số điện thoại trong .env)
    const text = `Mã OTP để xóa nhân viên ${targetId} là ${code}. Hết hạn sau 5 phút.`;

    const params = new URLSearchParams();
    params.set("mocean-to", ADMIN_PHONE);
    params.set("mocean-from", process.env.MOCEAN_FROM || "moceantest");
    params.set("mocean-text", text);

    console.log("📤 Gửi OTP:", params.toString());
    console.log("🔑 Bearer:", process.env.MOCEAN_BEARER);

    const resp = await axios.post(
      "https://rest.moceanapi.com/rest/2/sms",
      params.toString(),
      {
        headers: {
          Authorization: `Bearer ${process.env.MOCEAN_BEARER}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 15000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log("✅ Mocean gửi thành công:", resp.data);
      return res.json({
        ok: true,
        message: "Đã gửi OTP đến số admin",
      });
    } else {
      console.error("⚠️ Mocean trả lỗi:", resp.data);
      return res
        .status(502)
        .json({ ok: false, error: "mocean_error", detail: resp.data });
    }
  } catch (err) {
    console.error("❌ Lỗi gửi OTP:", err.response?.data || err.message);
    return res
      .status(500)
      .json({ ok: false, error: err.response?.data || err.message });
  }
};

// ============================================================
// ✅ XÁC MINH OTP VÀ XÓA NHÂN VIÊN
exports.verifyOtpAndDelete = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { code } = req.body;

    const rec = otpStore[employeeId];

    if (!rec)
      return res
        .status(400)
        .json({ ok: false, message: "OTP không tồn tại hoặc đã hết hạn" });

    if (Date.now() > rec.exp) {
      delete otpStore[employeeId];
      return res.status(400).json({ ok: false, message: "OTP đã hết hạn" });
    }

    if (code !== rec.code)
      return res.status(400).json({ ok: false, message: "OTP sai" });

    // ✅ OTP đúng → xóa nhân viên (tạm chỉ log, BE có thể query DB sau)
    delete otpStore[employeeId];
    console.log(`🗑️ Nhân viên ${employeeId} đã bị xóa`);

    return res.json({
      ok: true,
      message: `Đã xác thực OTP. Nhân viên ${employeeId} đã bị xóa.`,
    });
  } catch (err) {
    console.error("❌ Lỗi verify OTP:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
