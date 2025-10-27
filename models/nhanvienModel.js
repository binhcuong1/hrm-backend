const pool = require('../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query(`
    SELECT n.*, c.ten_chuc_vu, p.ten_phong_ban
    FROM nhan_vien n
    LEFT JOIN chuc_vu c ON n.ma_chuc_vu = c.ma_chuc_vu
    LEFT JOIN phong_ban p ON n.ma_phong_ban = p.ma_phong_ban
  `);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM nhan_vien WHERE ma_nhan_vien=?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban } = data;
  const [result] = await pool.query(
    'INSERT INTO nhan_vien (ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban) VALUES (?, ?, ?, ?, ?)',
    [ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban]
  );
  return result.insertId;
};

exports.update = async (id, data) => {
  const { ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban } = data;
  const [result] = await pool.query(
    'UPDATE nhan_vien SET ten_nhan_vien=?, email=?, sdt=?, ma_chuc_vu=?, ma_phong_ban=? WHERE ma_nhan_vien=?',
    [ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban, id]
  );
  return result.affectedRows;
};

exports.delete = async (id) => {
  const [result] = await pool.query('DELETE FROM nhan_vien WHERE ma_nhan_vien=?', [id]);
  return result.affectedRows;
};
