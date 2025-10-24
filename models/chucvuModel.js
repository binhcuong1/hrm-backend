const db = require('../config/db');
const table = 'chuc_vu';

module.exports = {
    async create(data) {
        const [r] = await db.query(`INSERT INTO ${table} SET ?`, [data]);
        return r.insertId;
    },
    async getAll() {
        const [rows] = await db.query(`SELECT * FROM ${table} ORDER BY ma_chuc_vu DESC`);
        return rows;
    },
    async getById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE ma_chuc_vu=? LIMIT 1`, [id]);
        return rows[0] || null;
    },
    async update(id, data) {
        await db.query(`UPDATE ${table} SET ? WHERE ma_chuc_vu=?`, [data, id]);
    },
    async delete(id) {
        await db.query(`DELETE FROM ${table} WHERE ma_chuc_vu=?`, [id]);
    }
};
