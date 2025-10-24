// models/nhanvienModel.js
const pool = require('../config/db');

module.exports = {
  // ✅ Lấy danh sách nhân viên
  getAll: async () => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          nv.ma_nhan_vien,
          nv.ten_nhan_vien,
          nv.email,
          nv.sdt,
          cv.ten_chuc_vu AS chuc_vu,
          pb.ten_phong_ban AS phong_ban
        FROM nhan_vien nv
        LEFT JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
        LEFT JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
        WHERE nv.da_xoa = 0
      `);
      return rows;
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách nhân viên:", error);
      throw error;
    }
  },

  // ✅ Thêm nhân viên (tự động gán phòng ban và chức vụ mặc định)
  create: async (nv) => {
    try {
      const { ten_nhan_vien, email, sdt } = nv;
      await pool.query(`
        INSERT INTO nhan_vien (ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban)
        VALUES (?, ?, ?, 1, 1)
      `, [ten_nhan_vien, email, sdt]);
    } catch (error) {
      console.error("❌ Lỗi thêm nhân viên:", error);
      throw error;
    }
  },

  // ✅ Cập nhật nhân viên
  update: async (id, nv) => {
    try {
      const { ten_nhan_vien, email, sdt } = nv;
      await pool.query(`
        UPDATE nhan_vien
        SET ten_nhan_vien = ?, email = ?, sdt = ?
        WHERE ma_nhan_vien = ?
      `, [ten_nhan_vien, email, sdt, id]);
    } catch (error) {
      console.error("❌ Lỗi cập nhật nhân viên:", error);
      throw error;
    }
  },

  // ✅ Xóa mềm nhân viên
  delete: async (id) => {
    try {
      await pool.query(`UPDATE nhan_vien SET da_xoa = 1 WHERE ma_nhan_vien = ?`, [id]);
    } catch (error) {
      console.error("❌ Lỗi xóa nhân viên:", error);
      throw error;
    }
  },
};
