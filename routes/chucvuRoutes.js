const express = require('express');
const router = express.Router();
const ChucVu = require('../models/chucvuModel');

router.get('/', async (req, res) => {
  try {
    const data = await ChucVu.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách chức vụ' });
  }
});

router.post('/', async (req, res) => {
  try {
    await ChucVu.add(req.body);
    res.json({ message: 'Thêm chức vụ thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi thêm chức vụ' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await ChucVu.update(req.params.id, req.body);
    res.json({ message: 'Cập nhật chức vụ thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật chức vụ' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ChucVu.delete(req.params.id);
    res.json({ message: 'Xóa chức vụ thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa chức vụ' });
  }
});

module.exports = router;
