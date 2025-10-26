const pool = require('../config/db');

exports.getAll = async () => {
  const [rows] = await pool.query(`
    SELECT n.*, c.tenChucVu, p.tenPhongBan
    FROM nhanvien n
    LEFT JOIN chucvu c ON n.ma_chuc_vu = c.id
    LEFT JOIN phongban p ON n.ma_phong_ban = p.id
  `);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM nhanvien WHERE id=?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban } = data;
  const [result] = await pool.query(
    'INSERT INTO nhanvien (ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban) VALUES (?, ?, ?, ?, ?)',
    [ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban]
  );
  return result.insertId;
};

exports.update = async (id, data) => {
  const { ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban } = data;
  const [result] = await pool.query(
    'UPDATE nhanvien SET ten_nhan_vien=?, email=?, sdt=?, ma_chuc_vu=?, ma_phong_ban=? WHERE id=?',
    [ten_nhan_vien, email, sdt, ma_chuc_vu, ma_phong_ban, id]
  );
  return result.affectedRows;
};

exports.delete = async (id) => {
  const [result] = await pool.query('DELETE FROM nhanvien WHERE id=?', [id]);
  return result.affectedRows;
};
