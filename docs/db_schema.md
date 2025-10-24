-- =============================
-- TẠO DATABASE
-- =============================
CREATE DATABASE IF NOT EXISTS ql_nhansu
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ql_nhansu;

-- =============================
-- BẢNG PHÒNG BAN
-- =============================
CREATE TABLE phong_ban (
    ma_phong_ban BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_phong_ban VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- =============================
-- BẢNG CHỨC VỤ
-- =============================
CREATE TABLE chuc_vu (
    ma_chuc_vu BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_chuc_vu VARCHAR(100) NOT NULL,
    he_so_luong DECIMAL(18,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- =============================
-- BẢNG NHÂN VIÊN
-- =============================
CREATE TABLE nhan_vien (
    ma_nhan_vien BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_chuc_vu BIGINT NOT NULL,
    ma_phong_ban BIGINT NOT NULL,
    ten_nhan_vien VARCHAR(120) NOT NULL,
    email VARCHAR(120),
    sdt VARCHAR(20),
    da_xoa TINYINT(1) DEFAULT 0,

    CONSTRAINT fk_nv_cv FOREIGN KEY (ma_chuc_vu) REFERENCES chuc_vu(ma_chuc_vu),
    CONSTRAINT fk_nv_pb FOREIGN KEY (ma_phong_ban) REFERENCES phong_ban(ma_phong_ban)
) ENGINE=InnoDB;

-- =============================
-- BẢNG PHỤ CẤP
-- =============================
CREATE TABLE phu_cap (
    ma_phu_cap BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_phu_cap VARCHAR(100) NOT NULL,
    so_tien DECIMAL(18,2) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- =============================
-- BẢNG CHI TIẾT PHỤ CẤP
-- =============================
CREATE TABLE CT_phu_cap (
    ma_phu_cap BIGINT NOT NULL,
    ma_nhan_vien BIGINT NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE,

    PRIMARY KEY (ma_phu_cap, ma_nhan_vien, ngay_bat_dau),
    CONSTRAINT fk_ctpc_pc FOREIGN KEY (ma_phu_cap) REFERENCES phu_cap(ma_phu_cap),
    CONSTRAINT fk_ctpc_nv FOREIGN KEY (ma_nhan_vien) REFERENCES nhan_vien(ma_nhan_vien)
) ENGINE=InnoDB;

-- =============================
-- BẢNG CA LÀM VIỆC
-- =============================
CREATE TABLE ca_lam_viec (
    ma_ca_lam_viec BIGINT PRIMARY KEY AUTO_INCREMENT,
    gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL
) ENGINE=InnoDB;

-- =============================
-- BẢNG CHI TIẾT CA LÀM VIỆC
-- =============================
CREATE TABLE CT_ca_lam_viec (
    ma_nhan_vien BIGINT NOT NULL,
    ma_ca_lam_viec BIGINT NOT NULL,
    trang_thai VARCHAR(50),

    PRIMARY KEY (ma_nhan_vien, ma_ca_lam_viec),
    CONSTRAINT fk_ctclv_nv FOREIGN KEY (ma_nhan_vien) REFERENCES nhan_vien(ma_nhan_vien),
    CONSTRAINT fk_ctclv_calv FOREIGN KEY (ma_ca_lam_viec) REFERENCES ca_lam_viec(ma_ca_lam_viec)
) ENGINE=InnoDB;

-- =============================
-- BẢNG CHẤM CÔNG
-- =============================
CREATE TABLE cham_cong (
    ma_cham_cong BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nhan_vien BIGINT NOT NULL,
    thang TINYINT NOT NULL,
    nam SMALLINT NOT NULL,
    songaycong_thucte DECIMAL(5,2) DEFAULT 0,
    sogio_lamthem DECIMAL(6,2) DEFAULT 0,

    CONSTRAINT fk_cc_nv FOREIGN KEY (ma_nhan_vien) REFERENCES nhan_vien(ma_nhan_vien),
    UNIQUE KEY uq_cc_nv (ma_nhan_vien, thang, nam)
) ENGINE=InnoDB;

-- =============================
-- BẢNG THƯỞNG PHẠT
-- =============================
CREATE TABLE thuong_phat (
    ma_thuong_phat BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nhan_vien BIGINT NOT NULL,
    ngay DATE NOT NULL,
    loai_tp ENUM('THUONG','PHAT') NOT NULL,
    so_tien DECIMAL(18,2) NOT NULL DEFAULT 0,
    ly_do VARCHAR(255),

    CONSTRAINT fk_tp_nv FOREIGN KEY (ma_nhan_vien) REFERENCES nhan_vien(ma_nhan_vien)
) ENGINE=InnoDB;

-- =============================
-- BẢNG TẠM ỨNG LƯƠNG
-- =============================
CREATE TABLE tam_ung_luong (
    ma_tam_ung BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nhan_vien BIGINT NOT NULL,
    ngay_ung DATE NOT NULL,
    so_tien DECIMAL(18,2) NOT NULL DEFAULT 0,
    ly_do VARCHAR(255),

    CONSTRAINT fk_tu_nv FOREIGN KEY (ma_nhan_vien) REFERENCES nhan_vien(ma_nhan_vien)
) ENGINE=InnoDB;

-- =============================
-- BẢNG LƯƠNG
-- =============================
CREATE TABLE bang_luong (
    ma_luong BIGINT PRIMARY KEY AUTO_INCREMENT,
    ma_nhan_vien BIGINT NOT NULL,
    thang TINYINT NOT NULL,
    nam SMALLINT NOT NULL,
    luong_co_so DECIMAL(18,2) DEFAULT 0,
    tong_phu_cap DECIMAL(18,2) DEFAULT 0,
    tong_thuong DECIMAL(18,2) DEFAULT 0,
    tong_phat DECIMAL(18,2) DEFAULT 0,
    luong_theo_ngay_cong DECIMAL(18,2) DEFAULT 0,
    tien_lam_them DECIMAL(18,2) DEFAULT 0,

    CONSTRAINT fk_bl_nv FOREIGN KEY (ma_nhan_vien) REFERENCES nhan_vien(ma_nhan_vien),
    UNIQUE KEY uq_bl_nv (ma_nhan_vien, thang, nam)
) ENGINE=InnoDB;
