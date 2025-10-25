const express = require("express");
const router = express.Router();
const bangluongController = require("../controllers/bangluongController");

router.post("/calc-all", bangluongController.calcAll); // Tính toàn bộ lương tháng
router.get("/monthly/:thang/:nam", bangluongController.getByMonth); // Danh sách bảng lương tháng
router.get(
  "/detail/:nhanvien/:thang/:nam",
  bangluongController.getPayrollDetail
); // Chi tiết 1 NV
router.post("/lock", bangluongController.lockMonth); // Chốt lương tháng
router.get("/export", bangluongController.exportPayroll); //Xuất file
router.post("/sendmail", bangluongController.sendPayrollEmail); //Gửi bảng lương qua mail

module.exports = router;
