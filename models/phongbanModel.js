const pool = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM phong_ban');
    return rows;
  },
  add: async (data) => {
    await pool.query('INSERT INTO phong_ban (ten_phong_ban) VALUES (?)', [data.ten_phong_ban]);
  },
  update: async (id, data) => {
    await pool.query('UPDATE phong_ban SET ten_phong_ban=? WHERE ma_phong_ban=?', [data.ten_phong_ban, id]);
  },
  delete: async (id) => {
    await pool.query('DELETE FROM phong_ban WHERE ma_phong_ban=?', [id]);
  },
};
