const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: "+07:00",
  waitForConnections: true,
  decimalNumbers: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Đã kết nối tới MySQL");
    conn.release();
  } catch (err) {
    console.error("Lỗi kết nối database!", err.message);
    process.exit(1);
  }
})();

module.exports = pool;
