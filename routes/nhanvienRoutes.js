const r = require('express').Router();
const NhanVienCtrl = require('../controllers/nhanvienController');

// GET /api/nhan-vien
r.get('/', NhanVienCtrl.getAll);

// POST /api/nhan-vien
r.post('/', NhanVienCtrl.create);

// GET /api/nhan-vien/:id
r.get('/:id', NhanVienCtrl.getById);

// PUT /api/nhan-vien/:id
r.put('/:id', NhanVienCtrl.update);

// DELETE /api/nhan-vien/:id
r.delete('/:id', NhanVienCtrl.delete);

module.exports = r;
