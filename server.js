const express = require('express');
const cors = require('cors');
const app = express();
require('./config/db');

const router = require('./routes/index');

// Cấu hình CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Lấy thông tin từ file .env
require('dotenv').config();

app.use(express.json()); // Bật tính năng đọc JSON
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Backend đang chạy');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy tại http://127.0.0.1:${PORT}`);
});