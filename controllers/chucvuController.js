const ChucVu = require('../models/chucvuModel');

exports.getAllChucVu = async (req, res) => {
  try {
    const list = await ChucVu.getAll();
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Lỗi lấy danh sách chức vụ' });
  }
};

exports.createChucVu = async (req, res) => {
  try {
    const { ten_chuc_vu, he_so_luong } = req.body; // ✅ Thêm he_so_luong
    const id = await ChucVu.create(ten_chuc_vu, he_so_luong);
    res.status(201).json({ id, ten_chuc_vu, he_so_luong });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi thêm chức vụ' });
  }
};

exports.updateChucVu = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_chuc_vu, he_so_luong } = req.body; // ✅ Thêm he_so_luong
    const affected = await ChucVu.update(id, ten_chuc_vu, he_so_luong);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy chức vụ' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi cập nhật chức vụ' });
  }
};

exports.deleteChucVu = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await ChucVu.delete(id);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy chức vụ' });
    res.json({ message: 'Xóa thành công' });
  } catch {
    res.status(500).json({ message: 'Lỗi xóa chức vụ' });
  }
};