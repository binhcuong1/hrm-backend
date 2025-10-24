const pool = require('../config/db');

const NhanVienController = {
  // 📋 Lấy danh sách nhân viên
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          nv.ma_nhan_vien,
          nv.ten_nhan_vien,
          nv.email,
          nv.sdt,
          nv.ma_chuc_vu,
          nv.ma_phong_ban,
          cv.ten_chuc_vu,
          pb.ten_phong_ban
        FROM nhan_vien nv
        JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
        JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
        WHERE nv.da_xoa = 0
      `);
      res.json({ success: true, data: rows });
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách nhân viên:", err);
      res.status(500).json({ success: false, message: "Không thể tải danh sách nhân viên" });
    }
  },

  // ➕ Thêm nhân viên
  add: async (req, res) => {
    try {
      const { ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban } = req.body;

      const [cv] = await pool.query(
        `SELECT ma_chuc_vu FROM chuc_vu WHERE ten_chuc_vu = ? LIMIT 1`,
        [req.body.ten_chuc_vu || '']
      );
      const [pb] = await pool.query(
        `SELECT ma_phong_ban FROM phong_ban WHERE ten_phong_ban = ? LIMIT 1`,
        [req.body.ten_phong_ban || '']
      );

      const chucVuId = ma_chuc_vu || (cv[0]?.ma_chuc_vu ?? 1);
      const phongBanId = ma_phong_ban || (pb[0]?.ma_phong_ban ?? 1);

      await pool.query(
        `INSERT INTO nhan_vien (ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban)
         VALUES (?, ?, ?, ?, ?)`,
        [ten_nhan_vien, email, sdt, chucVuId, phongBanId]
      );

      res.json({ success: true, message: "✅ Thêm nhân viên thành công!" });
    } catch (err) {
      console.error("❌ Lỗi thêm nhân viên:", err);
      res.status(500).json({ success: false, message: "Không thể thêm nhân viên" });
    }
  },

  // ✏️ Cập nhật nhân viên
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban } = req.body;

      const [cv] = await pool.query(
        `SELECT ma_chuc_vu FROM chuc_vu WHERE ten_chuc_vu = ? LIMIT 1`,
        [req.body.ten_chuc_vu || '']
      );
      const [pb] = await pool.query(
        `SELECT ma_phong_ban FROM phong_ban WHERE ten_phong_ban = ? LIMIT 1`,
        [req.body.ten_phong_ban || '']
      );

      const chucVuId = ma_chuc_vu || (cv[0]?.ma_chuc_vu ?? 1);
      const phongBanId = ma_phong_ban || (pb[0]?.ma_phong_ban ?? 1);

      await pool.query(
        `UPDATE nhan_vien 
         SET ten_nhan_vien=?, email=?, sdt=?, ma_chuc_vu=?, ma_phong_ban=?
         WHERE ma_nhan_vien=?`,
        [ten_nhan_vien, email, sdt, chucVuId, phongBanId, id]
      );

      res.json({ success: true, message: "✏️ Cập nhật nhân viên thành công!" });
    } catch (err) {
      console.error("❌ Lỗi cập nhật nhân viên:", err);
      res.status(500).json({ success: false, message: "Không thể cập nhật nhân viên" });
    }
  },

  // 🗑️ Xóa nhân viên
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query(`UPDATE nhan_vien SET da_xoa = 1 WHERE ma_nhan_vien = ?`, [id]);
      res.json({ success: true, message: "🗑️ Xóa nhân viên thành công" });
    } catch (err) {
      console.error("❌ Lỗi xóa nhân viên:", err);
      res.status(500).json({ success: false, message: "Không thể xóa nhân viên" });
    }
  },
};

module.exports = NhanVienController;
