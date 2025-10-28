// controllers/thuongphatController.js
const ThuongPhat = require('../models/thuongphatModel');

module.exports = {
  // GET /api/thuongphat
  async getAll(req, res) {
    try {
      const { loai_tp, ma_nhan_vien, from, to } = req.query;
      const list = await ThuongPhat.getAll({ loai_tp, ma_nhan_vien, from, to });
      return res.json(list);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy danh sách thưởng/phạt' });
    }
  },

  // GET /api/thuongphat/:id
  async getById(req, res) {
    try {
      const item = await ThuongPhat.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      return res.json(item);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy chi tiết thưởng/phạt' });
    }
  },

  // POST /api/thuongphat
  async create(req, res) {
    try {
      const id = await ThuongPhat.create(req.body);
      const created = await ThuongPhat.getById(id);
      return res.status(201).json(created);
    } catch (err) {
      console.error('Lỗi khi tạo thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi tạo thưởng/phạt' });
    }
  },

  // PUT /api/thuongphat/:id
  async update(req, res) {
    try {
      const id = req.params.id;
      const existed = await ThuongPhat.getById(id);
      if (!existed) return res.status(404).json({ message: 'Không tìm thấy bản ghi để cập nhật' });

      await ThuongPhat.update(id, req.body);
      const updated = await ThuongPhat.getById(id);
      return res.json(updated);
    } catch (err) {
      console.error('Lỗi khi cập nhật thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi cập nhật thưởng/phạt' });
    }
  },

  // DELETE /api/thuongphat/:id (xóa mềm)
  async remove(req, res) {
    try {
      const id = req.params.id;
      const existed = await ThuongPhat.getById(id);
      if (!existed) return res.status(404).json({ message: 'Không tìm thấy bản ghi để xóa' });

      await ThuongPhat.softDelete(id);
      return res.json({ message: 'Đã xóa (mềm) thưởng/phạt' });
    } catch (err) {
      console.error('Lỗi khi xóa thưởng/phạt:', err);
      return res.status(500).json({ message: 'Lỗi khi xóa thưởng/phạt' });
    }
  },
};
