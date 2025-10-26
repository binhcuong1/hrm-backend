// models/thuongphatModel.js
const db = require('../config/db');
const table = 'thuong_phat';

module.exports = {
    // ✅ Thêm mới bản ghi
    async create(data) {
        const [r] = await db.query(`INSERT INTO ${table} SET ?`, [data]);
        return r.insertId;
    },

    // ✅ Lấy toàn bộ (lọc theo loại, nhân viên, thời gian, nếu có)
    async getAll({ loai_tp, ma_nhan_vien, from, to } = {}) {
        const where = ['da_xoa = 0'];
        const vals = [];

        if (loai_tp) { where.push('loai_tp = ?'); vals.push(loai_tp); }
        if (ma_nhan_vien) { where.push('ma_nhan_vien = ?'); vals.push(ma_nhan_vien); }
        if (from) { where.push('ngay >= ?'); vals.push(from); }
        if (to) { where.push('ngay <= ?'); vals.push(to); }

        const sql = `SELECT * FROM ${table} WHERE ${where.join(' AND ')} ORDER BY ma_thuong_phat DESC`;
        const [rows] = await db.query(sql, vals);
        return rows;
    },

    // ✅ Lấy 1 bản ghi theo id
    async getById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE ma_thuong_phat=? LIMIT 1`, [id]);
        return rows[0] || null;
    },

    // ✅ Cập nhật bản ghi
    async update(id, data) {
        await db.query(`UPDATE ${table} SET ? WHERE ma_thuong_phat=?`, [data, id]);
    },

    // ✅ Xóa mềm
    async softDelete(id) {
        await db.query(`UPDATE ${table} SET da_xoa = 1 WHERE ma_thuong_phat=?`, [id]);
    }
};
