// controllers/phongbanController.js
const PhongBan = require('../models/phongbanModel');

exports.getAllPhongBan = async (req, res) => {
  try {
    const list = await PhongBan.getAll();
    res.json({
      success: true,
      data: list
    });
  } catch (err) {
    console.error('❌ Lỗi getAllPhongBan:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách phòng ban' });
  }
};

exports.createPhongBan = async (req, res) => {
  try {
    const { ten_phong_ban } = req.body;

    if (!ten_phong_ban || ten_phong_ban.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên phòng ban không được để trống'
      });
    }

    await PhongBan.add({ ten_phong_ban });
    res.status(201).json({
      success: true,
      message: 'Thêm phòng ban thành công'
    });
  } catch (err) {
    console.error('❌ Lỗi createPhongBan:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi thêm phòng ban',
      error: err.message
    });
  }
};

exports.updatePhongBan = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_phong_ban } = req.body;

    if (!ten_phong_ban || ten_phong_ban.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên phòng ban không được để trống'
      });
    }

    await PhongBan.update(id, { ten_phong_ban });
    res.json({
      success: true,
      message: 'Cập nhật phòng ban thành công'
    });
  } catch (err) {
    console.error('❌ Lỗi updatePhongBan:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật phòng ban',
      error: err.message
    });
  }
};

exports.deletePhongBan = async (req, res) => {
  try {
    const { id } = req.params;
    await PhongBan.delete(id);
    res.json({
      success: true,
      message: 'Xóa phòng ban thành công'
    });
  } catch (err) {
    console.error('❌ Lỗi deletePhongBan:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa phòng ban',
      error: err.message
    });
  }
};
