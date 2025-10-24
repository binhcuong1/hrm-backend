// controllers/thuongPhatController.js
const Joi = require('joi');
const ThuongPhat = require('../models/thuongPhatModel');
const NhanVien = require('../models/nhanVienModel');

// Schema validate
const schemaCreate = Joi.object({
  ma_nhan_vien: Joi.number().integer().required(),
  ngay: Joi.date().required(),
  loai_tp: Joi.string().valid('THUONG', 'PHAT').required(),
  so_tien: Joi.number().precision(2).min(0).required(),
  ly_do: Joi.string().allow('', null),
});

const schemaUpdate = Joi.object({
  ngay: Joi.date(),
  loai_tp: Joi.string().valid('THUONG', 'PHAT'),
  so_tien: Joi.number().precision(2).min(0),
  ly_do: Joi.string().allow('', null),
}).min(1);

module.exports = {
  // 📋 Lấy danh sách thưởng phạt
  async getAll(req, res) {
    try {
      const data = await ThuongPhat.findAll({
        include: [{ model: NhanVien, as: 'nhan_vien', attributes: ['ma_nhan_vien', 'ten_nhan_vien', 'email'] }],
        order: [['ma_thuong_phat', 'DESC']],
      });
      res.json(data);
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách thưởng phạt:', err);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách thưởng phạt' });
    }
  },

  // 🔍 Lấy theo id
  async getById(req, res) {
    try {
      const item = await ThuongPhat.findByPk(req.params.id, {
        include: [{ model: NhanVien, as: 'nhan_vien', attributes: ['ma_nhan_vien', 'ten_nhan_vien'] }],
      });
      if (!item) return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ➕ Tạo mới
  async create(req, res) {
    try {
      const { error, value } = schemaCreate.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const nv = await NhanVien.findByPk(value.ma_nhan_vien);
      if (!nv) return res.status(400).json({ message: 'Mã nhân viên không tồn tại' });

      const created = await ThuongPhat.create(value);
      res.status(201).json(created);
    } catch (err) {
      console.error('❌ Lỗi khi tạo thưởng phạt:', err);
      res.status(500).json({ message: 'Lỗi khi tạo thưởng phạt', error: err.message });
    }
  },

  // ✏️ Cập nhật
  async update(req, res) {
    try {
      const { error, value } = schemaUpdate.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const item = await ThuongPhat.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy bản ghi' });

      await item.update(value);
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // ❌ Xoá
  async remove(req, res) {
    try {
      const item = await ThuongPhat.findByPk(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      await item.destroy();
      res.json({ message: 'Đã xoá thưởng/phạt' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // 📄 Lấy theo nhân viên
  async getByNhanVien(req, res) {
    try {
      const { ma_nhan_vien } = req.params;
      const data = await ThuongPhat.findAll({
        where: { ma_nhan_vien },
        order: [['ngay', 'DESC']],
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // 📊 Thống kê tổng tiền thưởng / phạt
  async thongKeNhanVien(req, res) {
    try {
      const { ma_nhan_vien } = req.params;
      const all = await ThuongPhat.findAll({ where: { ma_nhan_vien } });
      const tongThuong = all.filter(x => x.loai_tp === 'THUONG').reduce((s, x) => s + Number(x.so_tien), 0);
      const tongPhat = all.filter(x => x.loai_tp === 'PHAT').reduce((s, x) => s + Number(x.so_tien), 0);
      res.json({ ma_nhan_vien, tongThuong, tongPhat, net: tongThuong - tongPhat, count: all.length });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
