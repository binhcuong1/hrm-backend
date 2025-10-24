const db = require('../config/db');
const table = 'khuon_mat_nhan_vien';

module.exports = {
    async create(data) {
        // data: { ma_nhan_vien, ten_file_json, duong_dan }
        const [r] = await db.query(`INSERT INTO ${table} SET ?`, [data]);
        return r.insertId;
    },
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM ${table} ORDER BY ma DESC`);
        return rows;
    },
    async getById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE ma=? LIMIT 1`, [id]);
        return rows[0] || null;
    },
    async update(id, data) {
        await db.query(`UPDATE ${table} SET ? WHERE ma=?`, [data, id]);
    },
    async delete(id) {
        await db.query(`DELETE FROM ${table} WHERE ma=?`, [id]);
    },
    async upsertByNhanVien({ ma_nhan_vien, ten_file_json, duong_dan }) {
        // UNIQUE (ma_nhan_vien) → ON DUPLICATE UPDATE
        const sql = `
      INSERT INTO ${table} (ma_nhan_vien, ten_file_json, duong_dan)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE ten_file_json=VALUES(ten_file_json), duong_dan=VALUES(duong_dan), cap_nhat_luc=NOW()
    `;
        await db.query(sql, [ma_nhan_vien, ten_file_json, duong_dan]);
    }
};
