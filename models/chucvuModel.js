const pool = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM chuc_vu');
    return rows;
  },
  add: async (data) => {
    await pool.query('INSERT INTO chuc_vu (ten_chuc_vu) VALUES (?)', [data.ten_chuc_vu]);
  },
  update: async (id, data) => {
    await pool.query('UPDATE chuc_vu SET ten_chuc_vu=? WHERE ma_chuc_vu=?', [data.ten_chuc_vu, id]);
  },
  delete: async (id) => {
    await pool.query('DELETE FROM chuc_vu WHERE ma_chuc_vu=?', [id]);
  },
};
