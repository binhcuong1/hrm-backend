// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// ✅ Khởi tạo Sequelize instance, đồng bộ hoàn toàn với các model
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    timezone: '+07:00',
    logging: false, // tắt log SQL trong console
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

// ✅ Test kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Đã kết nối tới MySQL thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
    process.exit(1);
  }
})();

module.exports = sequelize;
