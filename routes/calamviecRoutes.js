const express = require('express');
const router = express.Router();
const CaLamViecController = require('../controllers/calamviecController');

// 📋 Lấy danh sách tất cả ca làm việc
router.get('/', CaLamViecController.getAll);

// ➕ Thêm mới ca làm việc
router.post('/', CaLamViecController.add);

// ✏️ Cập nhật ca làm việc
router.put('/:id', CaLamViecController.update);

// 🗑️ Xóa (soft delete)
router.delete('/:id', CaLamViecController.delete);

module.exports = router;
