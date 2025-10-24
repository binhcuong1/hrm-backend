const express = require('express');
const router = express.Router();
const nhanVienController = require('controllers/nhanVienController');

// Routes cho nhân viên
router.get('/', nhanVienController.getAll);
router.get('/:id', nhanVienController.getById);
router.post('/', nhanVienController.create);
router.put('/:id', nhanVienController.update);
router.delete('/:id', nhanVienController.delete);

// Routes cho danh mục
router.get('/danh-muc/chuc-vu', nhanVienController.getChucVu);
router.get('/danh-muc/phong-ban', nhanVienController.getPhongBan);


// Import routes
const nhanVienRoutes = require('./routes/nhanVienRoutes');


// Sử dụng routes
app.use('/api/nhan-vien', nhanVienRoutes);


// Route kiểm tra
app.get('/', (req, res) => {
    res.json({ 
        message: 'HRM API Server đang chạy',
        status: 'success'
    });
});


// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📝 API Nhân viên: http://localhost:${PORT}/api/nhan-vien`);
});

module.exports = router;