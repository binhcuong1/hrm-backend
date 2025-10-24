const express = require('express');
const router = express.Router();
const PhongBan = require('../models/phongbanModel');

router.get('/', async (req, res) => {
  try {
    const data = await PhongBan.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng ban' });
  }
});

router.post('/', async (req, res) => {
  try {
    await PhongBan.add(req.body);
    res.json({ message: 'Thêm phòng ban thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi thêm phòng ban' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await PhongBan.update(req.params.id, req.body);
    res.json({ message: 'Cập nhật phòng ban thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật phòng ban' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await PhongBan.delete(req.params.id);
    res.json({ message: 'Xóa phòng ban thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa phòng ban' });
  }
});

module.exports = router;
