const PhongBan = require('../models/phongbanModel');

exports.getAllPhongBan = async (req, res) => {
  try {
    const list = await PhongBan.getAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách phòng ban' });
  }
};

exports.createPhongBan = async (req, res) => {
  try {
    const { tenPhongBan, moTa } = req.body;
    const id = await PhongBan.create(tenPhongBan, moTa);
    res.status(201).json({ id, tenPhongBan, moTa });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thêm phòng ban' });
  }
};

exports.updatePhongBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenPhongBan, moTa } = req.body;
    const affected = await PhongBan.update(id, tenPhongBan, moTa);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy phòng ban' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật phòng ban' });
  }
};

exports.deletePhongBan = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await PhongBan.delete(id);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy phòng ban' });
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa phòng ban' });
  }
};
