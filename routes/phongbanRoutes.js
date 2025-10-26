const express = require('express');
const router = express.Router();
const phongbanController = require('../controllers/phongbanController');

// Lấy danh sách tất cả phòng ban
router.get('/', phongbanController.getAllPhongBan);

// Tạo mới
router.post('/', phongbanController.createPhongBan);

// Cập nhật
router.put('/:id', phongbanController.updatePhongBan);

// Xóa
router.delete('/:id', phongbanController.deletePhongBan);

module.exports = router;
