const PhongBan = require('../models/phongbanModel');

exports.getAllPhongBan = async (req, res) => {
  try {
    const list = await PhongBan.getAll();
    res.json(list);
  } catch (err) {
    console.error('❌ Lỗi getAllPhongBan:', err); // ✅ Thêm log
    res.status(500).json({ message: 'Lỗi lấy danh sách phòng ban' });
  }
};

exports.createPhongBan = async (req, res) => {
  try {
    // ✅ ĐỔI SANG SNAKE_CASE (khớp với frontend)
    const { ten_phong_ban, mo_ta } = req.body;
    
    // ✅ Kiểm tra dữ liệu
    if (!ten_phong_ban || ten_phong_ban.trim() === '') {
      return res.status(400).json({ message: 'Tên phòng ban không được để trống' });
    }
    
    const id = await PhongBan.create(ten_phong_ban, mo_ta);
    res.status(201).json({ id, ten_phong_ban, mo_ta });
  } catch (err) {
    console.error('❌ Lỗi createPhongBan:', err); // ✅ Thêm log
    res.status(500).json({ message: 'Lỗi thêm phòng ban', error: err.message });
  }
};

exports.updatePhongBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_phong_ban, mo_ta } = req.body; // ✅ Đổi sang snake_case
    
    const affected = await PhongBan.update(id, ten_phong_ban, mo_ta);
    if (!affected) return res.status(404).json({ message: 'Không tìm thấy phòng ban' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    console.error('❌ Lỗi updatePhongBan:', err);
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
    console.error('❌ Lỗi deletePhongBan:', err);
    res.status(500).json({ message: 'Lỗi xóa phòng ban' });
  }
};