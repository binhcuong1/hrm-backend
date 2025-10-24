const express = require('express');
const router = express.Router();

router.use('/chucvu', require('./chucvuRoutes'));
router.use('/khuon-mat', require('./khuonmatRoutes'));
router.use('/nhan-vien', require('./nhanvienRoutes'));
app.use('/auth', require('./authRoutes'));
app.use('/calamviec', require('./calamviecRoutes'));
app.use('/phongban', require('./phongbanRoutes'));

module.exports = router;