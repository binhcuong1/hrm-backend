const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const verifyToken = require("../middleware/verifyToken");

// ============================================================
// 🔹 GỬI OTP CHO ADMIN XÁC NHẬN XÓA NHÂN VIÊN
//  -> Flutter sẽ luôn gọi /otp/send-delete/1 (id=1 là admin)
router.post("/send-delete/:adminId", verifyToken, otpController.sendOtpForDelete);

// ============================================================
// 🔹 XÁC MINH OTP & XÓA NHÂN VIÊN
//  -> Flutter sẽ gọi /otp/verify-delete/:employeeId
router.post("/verify-delete/:employeeId", verifyToken, otpController.verifyOtpAndDelete);

module.exports = router;
