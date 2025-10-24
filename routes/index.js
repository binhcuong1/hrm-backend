// routes/index.js
const express = require('express');
const router = express.Router();

const chucvuRoutes = require('./chucvuRoutes');
const nhanVienRoutes = require('./nhanVienRoutes');       // NEW
const thuongPhatRoutes = require('./thuongPhatRoutes');   // NEW

router.use('/chucvu', chucvuRoutes);
router.use('/nhanvien', nhanVienRoutes);       // NEW
router.use('/thuongphat', thuongPhatRoutes);   // NEW

module.exports = router;
