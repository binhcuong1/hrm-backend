// routes/nhanvienRoutes.js
const express = require('express');
const router = express.Router();
const NhanVienController = require('../controllers/nhanvienController');

// 📋 Lấy danh sách nhân viên
router.get('/', NhanVienController.getAll);

// ➕ Thêm nhân viên
router.post('/', NhanVienController.add);

// ✏️ Cập nhật nhân viên
router.put('/:id', NhanVienController.update);

// 🗑️ Xóa nhân viên
router.delete('/:id', NhanVienController.delete);

module.exports = router;
