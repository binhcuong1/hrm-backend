const pool = require('../config/db');

// 🔹 Lấy tất cả phòng ban
exports.getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM phongban');
  return rows;
};

// 🔹 Thêm mới phòng ban
exports.create = async (tenPhongBan, moTa) => {
  const [result] = await pool.query(
    'INSERT INTO phongban (tenPhongBan, moTa) VALUES (?, ?)',
    [tenPhongBan, moTa]
  );
  return result.insertId;
};

// 🔹 Cập nhật
exports.update = async (id, tenPhongBan, moTa) => {
  const [result] = await pool.query(
    'UPDATE phongban SET tenPhongBan=?, moTa=? WHERE id=?',
    [tenPhongBan, moTa, id]
  );
  return result.affectedRows;
};

// 🔹 Xóa
exports.delete = async (id) => {
  const [result] = await pool.query('DELETE FROM phongban WHERE id=?', [id]);
  return result.affectedRows;
};
