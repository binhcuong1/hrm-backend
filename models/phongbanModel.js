const pool = require('../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM phong_ban');
  return rows;
};

exports.create = async (tenPhongBan, moTa) => {
  const [result] = await pool.query(
    'INSERT INTO phong_ban (ten_phong_ban) VALUES (?)',
    [tenPhongBan]
  );
  return result.insertId;
};

exports.update = async (id, tenPhongBan, moTa) => {
  const [result] = await pool.query(
    'UPDATE phong_ban SET ten_phong_ban=? WHERE ma_phong_ban=?',
    [tenPhongBan, id]
  );
  return result.affectedRows;
};

exports.delete = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM phong_ban WHERE ma_phong_ban=?',
    [id]
  );
  return result.affectedRows;
};
