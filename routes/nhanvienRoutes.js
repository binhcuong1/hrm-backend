const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanvienController');

// ===== CRUD nhân viên =====
router.get('/', nhanVienController.getAll);
router.get('/:id', nhanVienController.getById);
router.post('/', nhanVienController.create);
router.put('/:id', nhanVienController.update);
router.delete('/:id', nhanVienController.delete);

// ===== Danh mục phụ =====
router.get('/danh-muc/chuc-vu', nhanVienController.getChucVu);
router.get('/danh-muc/phong-ban', nhanVienController.getPhongBan);

module.exports = router;
