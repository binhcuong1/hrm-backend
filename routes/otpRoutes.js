// routes/otpRoutes.js
const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const verifyToken = require("../middleware/verifyToken");

// Gửi OTP khi xóa nhân viên
router.post("/send-delete/:id", verifyToken, otpController.sendDeleteOtp);

// Xác minh OTP và xóa nhân viên
router.post("/verify-delete/:id", verifyToken, otpController.verifyDeleteOtp);

module.exports = router;
