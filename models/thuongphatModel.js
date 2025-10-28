// models/thuongphatModel.js
const db = require('../config/db');
const table = 'thuong_phat';

module.exports = {
  // 🔹 Thêm mới
  async create(data) {
    const [r] = await db.query(`INSERT INTO ${table} SET ?`, [data]);
    return r.insertId;
  },

  // 🔹 Lấy danh sách
  async getAll({ loai_tp, ma_nhan_vien, from, to } = {}) {
    const where = ['tp.da_xoa = 0'];
    const vals = [];

    if (loai_tp) { where.push('tp.loai_tp = ?'); vals.push(loai_tp); }
    if (ma_nhan_vien) { where.push('tp.ma_nhan_vien = ?'); vals.push(ma_nhan_vien); }
    if (from) { where.push('tp.ngay >= ?'); vals.push(from); }
    if (to) { where.push('tp.ngay <= ?'); vals.push(to); }

    const sql = `
      SELECT tp.*, nv.ten_nhan_vien AS ten_nhan_vien
      FROM ${table} tp
      LEFT JOIN nhan_vien nv ON tp.ma_nhan_vien = nv.ma_nhan_vien
      WHERE ${where.join(' AND ')}
      ORDER BY tp.ma_thuong_phat DESC
    `;
    const [rows] = await db.query(sql, vals);
    return rows;
  },

  // 🔹 Lấy theo ID
  async getById(id) {
    const sql = `
      SELECT tp.*, nv.ten_nhan_vien AS ten_nhan_vien
      FROM ${table} tp
      LEFT JOIN nhan_vien nv ON tp.ma_nhan_vien = nv.ma_nhan_vien
      WHERE tp.ma_thuong_phat = ? LIMIT 1
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  },

  // 🔹 Cập nhật
  async update(id, data) {
    await db.query(`UPDATE ${table} SET ? WHERE ma_thuong_phat = ?`, [data, id]);
  },

  // 🔹 Xóa mềm
  async softDelete(id) {
    await db.query(`UPDATE ${table} SET da_xoa = 1 WHERE ma_thuong_phat = ?`, [id]);
  },
};
