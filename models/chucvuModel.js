const pool = require('../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM chuc_vu');
  return rows;
};

exports.create = async (tenChucVu, heSoLuong = 1) => { // ✅ Thêm tham số
  const [result] = await pool.query(
    'INSERT INTO chuc_vu (ten_chuc_vu, he_so_luong) VALUES (?, ?)', // ✅ Thêm cột
    [tenChucVu, heSoLuong]
  );
  return result.insertId;
};

exports.update = async (id, tenChucVu, heSoLuong) => { // ✅ Thêm tham số
  const [result] = await pool.query(
    'UPDATE chuc_vu SET ten_chuc_vu=?, he_so_luong=? WHERE ma_chuc_vu=?', // ✅ Thêm cột
    [tenChucVu, heSoLuong, id]
  );
  return result.affectedRows;
};

exports.delete = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM chuc_vu WHERE ma_chuc_vu=?',
    [id]
  );
  return result.affectedRows;
};