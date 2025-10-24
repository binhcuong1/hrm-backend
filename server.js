const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./config/db');

// ✅ Import routes
const nhanvienRoutes = require('./routes/nhanvienRoutes');
const calamviecRoutes = require('./routes/calamviecRoutes');
const chucvuRoutes = require('./routes/chucvuRoutes');
const phongbanRoutes = require('./routes/phongbanRoutes');
const authRoutes = require('./routes/authRoutes');

// ⚙️ Cấu hình CORS (cho phép từ mọi nơi — cần cho Flutter emulator)
app.use(cors({
  origin: '*', // ⚠️ Đổi từ 127.0.0.1 sang * để emulator truy cập được
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// ⚙️ Middleware để đọc JSON body
app.use(express.json());

// ✅ Đăng ký router
app.use('/api/auth', authRoutes);
app.use('/api/nhanvien', nhanvienRoutes);
app.use('/api/calamviec', calamviecRoutes);
app.use('/api/chucvu', chucvuRoutes);
app.use('/api/phongban', phongbanRoutes);

// ✅ Route test
app.get('/', (req, res) => {
  res.send('Backend đang chạy 🚀');
});

// ✅ Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server đang chạy tại http://127.0.0.1:${PORT}`);
});
