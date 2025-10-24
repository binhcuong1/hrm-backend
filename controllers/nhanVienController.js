// controllers/nhanVienController.js
const Joi = require('joi');
const NhanVien = require('../models/nhanVienModel');

// ✅ Schema validation
const schemaCreate = Joi.object({
  ma_chuc_vu: Joi.number().integer().required(),
  ma_phong_ban: Joi.number().integer().required(),
  ten_nhan_vien: Joi.string().max(120).required(),
  email: Joi.string().email().allow(null, ''),
  sdt: Joi.string().max(20).allow(null, ''),
});



module.exports = {
  // GET /api/nhan-vien
  async getAll(req, res) {
    try {
      const list = await NhanVien.findAll({
        where: { da_xoa: 0 },
        order: [['ma_nhan_vien', 'ASC']],
      });
      res.json(list);
    } catch (err) {
  console.error('❌ Lỗi SQL khi tạo nhân viên:');
  console.error(err); // In chi tiết lỗi ra terminal

  res.status(500).json({
    message: 'Lỗi khi tạo nhân viên',
    error: err.message, // 👈 thêm dòng này để FE cũng nhận lỗi cụ thể
  });
}
  },

  // GET /api/nhan-vien/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const nv = await NhanVien.findByPk(id);
      if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      res.json(nv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi lấy thông tin nhân viên' });
    }
  },

  // POST /api/nhan-vien
    async create(req, res) {
    try {
        const { error, value } = schemaCreate.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const nv = await NhanVien.create(value);
        res.status(201).json(nv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi tạo nhân viên' });
    }
    },


  // PUT /api/nhan-vien/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = schemaUpdate.validate(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const nv = await NhanVien.findByPk(id);
      if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

      await nv.update(value);
      res.json(nv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi cập nhật nhân viên' });
    }
  },

  // DELETE /api/nhan-vien/:id (xoá mềm)
  async remove(req, res) {
    try {
      const { id } = req.params;
      const nv = await NhanVien.findByPk(id);
      if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

      await nv.update({ da_xoa: 1 });
      res.json({ message: 'Đã đánh dấu xoá nhân viên' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi xoá nhân viên' });
    }
  },

  // ✅ Khôi phục nhân viên (nếu cần)
  async restore(req, res) {
    try {
      const { id } = req.params;
      const nv = await NhanVien.findByPk(id);
      if (!nv) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

      await nv.update({ da_xoa: 0 });
      res.json({ message: 'Đã khôi phục nhân viên' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi khôi phục nhân viên' });
    }
  },
};
