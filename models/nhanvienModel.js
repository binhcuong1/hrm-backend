const db = require('../config/db');

class NhanVienModel {
    // Lấy tất cả nhân viên
    static async getAll() {
        const query = `
      SELECT nv.*, cv.ten_chuc_vu, pb.ten_phong_ban 
      FROM nhan_vien nv
      LEFT JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
      LEFT JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
      ORDER BY nv.ma_nhan_vien DESC
    `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Lấy nhân viên theo ID
    static async getById(id) {
        const query = `
      SELECT nv.*, cv.ten_chuc_vu, pb.ten_phong_ban 
      FROM nhan_vien nv
      LEFT JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
      LEFT JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
      WHERE nv.ma_nhan_vien = ?
    `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // Thêm nhân viên mới
    static async create(data) {
        const query = `
      INSERT INTO nhan_vien (ma_chuc_vu, ma_phong_ban, ten_nhan_vien, email, sdt, da_xoa)
      VALUES (?, ?, ?, ?, ?, 0)
    `;
        const [result] = await db.execute(query, [
            data.ma_chuc_vu,
            data.ma_phong_ban,
            data.ten_nhan_vien,
            data.email,
            data.sdt
        ]);
        return result.insertId;
    }

    // Cập nhật nhân viên
    static async update(id, data) {
        const query = `
      UPDATE nhan_vien 
      SET ma_chuc_vu = ?, ma_phong_ban = ?, ten_nhan_vien = ?, email = ?, sdt = ?
      WHERE ma_nhan_vien = ?
    `;
        const [result] = await db.execute(query, [
            data.ma_chuc_vu,
            data.ma_phong_ban,
            data.ten_nhan_vien,
            data.email,
            data.sdt,
            id
        ]);
        return result.affectedRows;
    }

    // Xóa nhân viên (soft delete)
    static async delete(id) {
        const query = `UPDATE nhan_vien SET da_xoa = 1 WHERE ma_nhan_vien = ?`;
        const [result] = await db.execute(query, [id]);
        return result.affectedRows;
    }

    // Lấy danh sách chức vụ
    static async getChucVu() {
        const query = `SELECT * FROM chuc_vu WHERE ma_chuc_vu IS NOT NULL ORDER BY ten_chuc_vu`;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Lấy danh sách phòng ban
    static async getPhongBan() {
        const query = `SELECT * FROM phong_ban WHERE ma_phong_ban IS NOT NULL ORDER BY ten_phong_ban`;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Kiểm tra email trùng
    static async checkEmailExists(email, excludeId = null) {
        let query = `SELECT ma_nhan_vien FROM nhan_vien WHERE email = ? AND da_xoa = 0`;
        const params = [email];

        if (excludeId) {
            query += ` AND ma_nhan_vien != ?`;
            params.push(excludeId);
        }

        const [rows] = await db.execute(query, params);
        return rows.length > 0;
    }
}

module.exports = NhanVienModel;