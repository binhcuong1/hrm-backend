// models/nhanVienModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NhanVien = sequelize.define('nhan_vien', {
  ma_nhan_vien: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  ma_chuc_vu:   { type: DataTypes.BIGINT, allowNull: false },
  ma_phong_ban: { type: DataTypes.BIGINT, allowNull: false },
  ten_nhan_vien:{ type: DataTypes.STRING(120), allowNull: false },
  email:        { type: DataTypes.STRING(120) },
  sdt:          { type: DataTypes.STRING(20) },
  da_xoa:       { type: DataTypes.TINYINT, defaultValue: 0 },
}, {
  tableName: 'nhan_vien',
  underscored: true,
});

module.exports = NhanVien;
