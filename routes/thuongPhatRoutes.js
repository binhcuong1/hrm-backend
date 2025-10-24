// routes/thuongPhatRoutes.js
const express = require('express');
const ctrl = require('../controllers/thuongPhatController');
const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/nhan-vien/:ma_nhan_vien', ctrl.getByNhanVien);
router.get('/thong-ke/:ma_nhan_vien', ctrl.thongKeNhanVien);

router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
