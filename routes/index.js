const express = require('express');
const router = express.Router();

const nhanvienRoutes = require('./nhanvienRoutes');
const chucvuRoutes = require('./chucvuRoutes');
const phongbanRoutes = require('./phongbanRoutes'); // 👈 thêm dòng này

router.use('/nhanvien', nhanvienRoutes);
router.use('/chucvu', chucvuRoutes);
router.use('/phongban', phongbanRoutes); // 👈 thêm dòng này

module.exports = router;
