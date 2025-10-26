const pool = require('../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM chucvu');
  return rows;
};

exports.create = async (tenChucVu) => {
  const [result] = await pool.query(
    'INSERT INTO chucvu (tenChucVu) VALUES (?)',
    [tenChucVu]
  );
  return result.insertId;
};

exports.update = async (id, tenChucVu) => {
  const [result] = await pool.query(
    'UPDATE chucvu SET tenChucVu=? WHERE id=?',
    [tenChucVu, id]
  );
  return result.affectedRows;
};

exports.delete = async (id) => {
  const [result] = await pool.query('DELETE FROM chucvu WHERE id=?', [id]);
  return result.affectedRows;
};
