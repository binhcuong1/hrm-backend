const db = require('../config/db');
const table = 'nhan_vien';

module.exports = {
    async create(data) {
        const [r] = await db.query(`INSERT INTO ${table} SET ?`, [data]);
        return r.insertId;
    },
    async getAll() {
        const [rows] = await db.query(`SELECT nv.*, cv.ten_chuc_vu, pb.ten_phong_ban FROM ${table} nv
            LEFT JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
            LEFT JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
            WHERE nv.da_xoa = 0
            ORDER BY nv.ma_nhan_vien DESC`);
        return rows;
    },
    async getById(id) {
        const [rows] = await db.query(`SELECT nv.*, cv.ten_chuc_vu, pb.ten_phong_ban FROM ${table} nv
            LEFT JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
            LEFT JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
            WHERE nv.ma_nhan_vien=? LIMIT 1`, [id]);
        return rows[0] || null;
    },
    async update(id, data) {
        await db.query(`UPDATE ${table} SET ? WHERE ma_nhan_vien=?`, [data, id]);
    },
    async delete(id) {
        // soft-delete: set da_xoa = 1
        await db.query(`UPDATE ${table} SET da_xoa=1 WHERE ma_nhan_vien=?`, [id]);
    }
};
