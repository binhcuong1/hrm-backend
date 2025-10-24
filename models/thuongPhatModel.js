// models/thuongPhatModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const NhanVien = require('./nhanVienModel');

const ThuongPhat = sequelize.define('thuong_phat', {
  ma_thuong_phat: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  ma_nhan_vien:   { type: DataTypes.BIGINT, allowNull: false },
  ngay:           { type: DataTypes.DATEONLY, allowNull: false },
  loai_tp:        { type: DataTypes.ENUM('THUONG', 'PHAT'), allowNull: false },
  so_tien:        { type: DataTypes.DECIMAL(18,2), allowNull: false, defaultValue: 0 },
  ly_do:          { type: DataTypes.STRING(255) },
}, {
  tableName: 'thuong_phat',
  underscored: true,
});

// Liên kết với bảng nhân viên
ThuongPhat.belongsTo(NhanVien, { foreignKey: 'ma_nhan_vien', as: 'nhan_vien' });
NhanVien.hasMany(ThuongPhat, { foreignKey: 'ma_nhan_vien', as: 'thuong_phat' });

module.exports = ThuongPhat;
