const NhanVien = require('../models/nhanvienModel');
const ChucVu = require('../models/chucvuModel');
const PhongBan = require('../models/phongbanModel');

exports.getAll = async (req, res) => {
  try {
    const list = await NhanVien.getAll();
    res.json(list);
  } catch {
    res.status(500).json({ message: 'Lỗi lấy danh sách nhân viên' });
  }
};

exports.getById = async (req, res) => {
  try {
    const nv = await NhanVien.getById(req.params.id);
    if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(nv);
  } catch {
    res.status(500).json({ message: 'Lỗi lấy nhân viên' });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await NhanVien.create(req.body);
    res.status(201).json({ message: 'Thêm thành công', id });
  } catch {
    res.status(500).json({ message: 'Lỗi thêm nhân viên' });
  }
};

exports.update = async (req, res) => {
  try {
    const affected = await NhanVien.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Cập nhật thành công' });
  } catch {
    res.status(500).json({ message: 'Lỗi cập nhật nhân viên' });
  }
};

exports.delete = async (req, res) => {
  try {
    const affected = await NhanVien.delete(req.params.id);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Xóa thành công' });
  } catch {
    res.status(500).json({ message: 'Lỗi xóa nhân viên' });
  }
};

// Lấy danh mục chức vụ
exports.getChucVu = async (req, res) => {
  const list = await ChucVu.getAll();
  res.json(list);
};

// Lấy danh mục phòng ban
exports.getPhongBan = async (req, res) => {
  const list = await PhongBan.getAll();
  res.json(list);
};
