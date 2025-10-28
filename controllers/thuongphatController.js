// controllers/thuongphatController.js
const ThuongPhat = require('../models/thuongphatModel');
const NhanVien = require('../models/nhanvienModel');

module.exports = {
  // 🔹 GET /api/thuongphat
  async getAll(req, res) {
    try {
      const { loai_tp, ma_nhan_vien, from, to } = req.query;
      const list = await ThuongPhat.getAll({ loai_tp, ma_nhan_vien, from, to });
      return res.json(list);
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy danh sách thưởng/phạt', error: err.message });
    }
  },

  // 🔹 GET /api/thuongphat/:id
  async getById(req, res) {
    try {
      const item = await ThuongPhat.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      return res.json(item);
    } catch (err) {
      console.error('❌ Lỗi khi lấy chi tiết thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy chi tiết thưởng/phạt', error: err.message });
    }
  },

  // 🔹 POST /api/thuongphat
  async create(req, res) {
    try {
      console.log('🟢 [CREATE] Dữ liệu FE gửi:', req.body);

      // ✅ Kiểm tra mã nhân viên có tồn tại không
      const nv = await NhanVien.getById(req.body.ma_nhan_vien);
      if (!nv) {
        return res.status(400).json({ message: 'Mã nhân viên không tồn tại trong hệ thống' });
      }

      // ✅ Chuyển ngày từ ISO sang yyyy-MM-dd (MySQL DATE)
      if (req.body.ngay && req.body.ngay.includes('T')) {
        req.body.ngay = req.body.ngay.split('T')[0];
      }

      const id = await ThuongPhat.create(req.body);
      const created = await ThuongPhat.getById(id);
      return res.status(201).json(created);
    } catch (err) {
      console.error('❌ Lỗi khi tạo thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi tạo thưởng/phạt', error: err.message });
    }
  },

  // 🔹 PUT /api/thuongphat/:id
  async update(req, res) {
    try {
      const id = req.params.id;
      console.log('🟡 [UPDATE] ID:', id, 'Body:', req.body);

      const existed = await ThuongPhat.getById(id);
      if (!existed) return res.status(404).json({ message: 'Không tìm thấy bản ghi để cập nhật' });

      // ✅ Fix định dạng ngày
      if (req.body.ngay && req.body.ngay.includes('T')) {
        req.body.ngay = req.body.ngay.split('T')[0];
      }

      // ✅ Lọc field hợp lệ
      const allowed = ['ma_nhan_vien', 'loai_tp', 'so_tien', 'ly_do', 'ngay'];
      const dataToUpdate = {};
      for (const key of allowed) {
        if (req.body[key] !== undefined) dataToUpdate[key] = req.body[key];
      }

      await ThuongPhat.update(id, dataToUpdate);
      const updated = await ThuongPhat.getById(id);
      return res.json(updated);
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi cập nhật thưởng/phạt', error: err.message });
    }
  },

  // 🔹 DELETE /api/thuongphat/:id
  async remove(req, res) {
    try {
      const id = req.params.id;
      const existed = await ThuongPhat.getById(id);
      if (!existed) return res.status(404).json({ message: 'Không tìm thấy bản ghi để xóa' });

      await ThuongPhat.softDelete(id);
      return res.json({ message: 'Đã xóa (mềm) thưởng/phạt' });
    } catch (err) {
      console.error('❌ Lỗi khi xóa thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi xóa thưởng/phạt', error: err.message });
    }
  },
};
