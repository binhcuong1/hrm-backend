const pool = require('../config/db');

module.exports = {
  // 📋 Lấy danh sách ca làm việc
  getAll: async () => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          ma_ca_lam_viec,
          ten_ca,
          gio_bat_dau,
          gio_ket_thuc,
          ngay_lam_viec,
          da_xoa
        FROM ca_lam_viec
        WHERE da_xoa = 0 OR da_xoa IS NULL
        ORDER BY ngay_lam_viec DESC, gio_bat_dau ASC
      `);
      return rows;
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách ca làm việc:", error);
      throw error;
    }
  },

  // ➕ Thêm ca làm việc
  add: async (data) => {
    try {
      const { ten_ca, gio_bat_dau, gio_ket_thuc, ngay_lam_viec } = data;
      await pool.query(
        `INSERT INTO ca_lam_viec (ten_ca, gio_bat_dau, gio_ket_thuc, ngay_lam_viec)
         VALUES (?, ?, ?, ?)`,
        [ten_ca, gio_bat_dau, gio_ket_thuc, ngay_lam_viec]
      );
    } catch (error) {
      console.error("❌ Lỗi thêm ca làm việc:", error);
      throw error;
    }
  },

  // ✏️ Cập nhật ca làm việc
  update: async (id, data) => {
    try {
      const { ten_ca, gio_bat_dau, gio_ket_thuc, ngay_lam_viec } = data;
      await pool.query(
        `UPDATE ca_lam_viec 
         SET ten_ca = ?, gio_bat_dau = ?, gio_ket_thuc = ?, ngay_lam_viec = ?
         WHERE ma_ca_lam_viec = ?`,
        [ten_ca, gio_bat_dau, gio_ket_thuc, ngay_lam_viec, id]
      );
    } catch (error) {
      console.error("❌ Lỗi cập nhật ca làm việc:", error);
      throw error;
    }
  },

  // 🗑️ Xóa ca làm việc (soft delete)
  delete: async (id) => {
    try {
      await pool.query(`UPDATE ca_lam_viec SET da_xoa = 1 WHERE ma_ca_lam_viec = ?`, [id]);
    } catch (error) {
      console.error("❌ Lỗi xóa ca làm việc:", error);
      throw error;
    }
  },
};
