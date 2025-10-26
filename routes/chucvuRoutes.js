const express = require('express');
const router = express.Router();
const chucvuController = require('../controllers/chucvuController');

// Lấy toàn bộ chức vụ
router.get('/', chucvuController.getAllChucVu);

// Thêm chức vụ mới
router.post('/', chucvuController.createChucVu);

// Cập nhật chức vụ
router.put('/:id', chucvuController.updateChucVu);

// Xóa chức vụ
router.delete('/:id', chucvuController.deleteChucVu);

module.exports = router;
