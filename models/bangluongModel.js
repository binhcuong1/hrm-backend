const db = require("../config/db");

module.exports = {
  // ============================
  // TÍNH LƯƠNG 1 NHÂN VIÊN
  // ============================
  async calcSalary(ma_nhan_vien, thang, nam) {
    const [[nv]] = await db.query(
      `
      SELECT nv.ma_nhan_vien, cv.he_so_luong, 5000000 AS luong_co_so
      FROM nhan_vien nv
      JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
      WHERE nv.ma_nhan_vien=?`,
      [ma_nhan_vien]
    );
    if (!nv) throw new Error("Nhân viên không tồn tại");

    // Chấm công (fallback an toàn)
    const [ccRows] = await db.query(
      `
      SELECT songaycong_thucte, sogio_lamthem
      FROM cham_cong
      WHERE ma_nhan_vien=? AND thang=? AND nam=?`,
      [ma_nhan_vien, thang, nam]
    );
    const cc = ccRows?.[0] || { songaycong_thucte: 0, sogio_lamthem: 0 };

    // Phụ cấp
    const [[pc]] = await db.query(
      `
      SELECT COALESCE(SUM(p.so_tien),0) AS tong_phu_cap
      FROM CT_phu_cap ct
      JOIN phu_cap p ON ct.ma_phu_cap = p.ma_phu_cap
      WHERE ct.ma_nhan_vien=? 
        AND (ct.ngay_ket_thuc IS NULL OR ct.ngay_ket_thuc >= LAST_DAY(CONCAT(?, '-', ?, '-01')))
      `,
      [ma_nhan_vien, nam, thang]
    );

    // Thưởng / phạt
    const [[tp]] = await db.query(
      `
      SELECT 
        COALESCE(SUM(CASE WHEN loai_tp='THUONG' THEN so_tien END),0) AS tong_thuong,
        COALESCE(SUM(CASE WHEN loai_tp='PHAT' THEN so_tien END),0) AS tong_phat
      FROM thuong_phat
      WHERE ma_nhan_vien=? AND MONTH(ngay)=? AND YEAR(ngay)=?
      `,
      [ma_nhan_vien, thang, nam]
    );

    // Tạm ứng
    const [[tu]] = await db.query(
      `
      SELECT COALESCE(SUM(so_tien),0) AS tong_tam_ung
      FROM tam_ung_luong
      WHERE ma_nhan_vien=? AND MONTH(ngay_ung)=? AND YEAR(ngay_ung)=?
      `,
      [ma_nhan_vien, thang, nam]
    );

    // Tính toán
    const luong_co_ban =
      Number(nv.luong_co_so || 0) * Number(nv.he_so_luong || 0);
    const ngayCong = Number(cc.songaycong_thucte || 0);
    const gioThem = Number(cc.sogio_lamthem || 0);
    const tong_phu_cap = Number(pc?.tong_phu_cap || 0);
    const tong_thuong = Number(tp?.tong_thuong || 0);
    const tong_phat = Number(tp?.tong_phat || 0);
    const tong_tam_ung = Number(tu?.tong_tam_ung || 0);
    const luong_theo_ngay_cong = ngayCong * (luong_co_ban / 26);
    const tien_lam_them = gioThem * 50000;
    const tong_luong =
      luong_theo_ngay_cong + tien_lam_them + tong_phu_cap + tong_thuong;

    const thuc_linh = tong_luong - (tong_phat + tong_tam_ung);

    // Cập nhật bảng lương
    await db.query(
      `
      INSERT INTO bang_luong (
        ma_nhan_vien, thang, nam, luong_co_so,
        tong_phu_cap, tong_thuong, tong_phat,
        luong_theo_ngay_cong, tien_lam_them,
        tong_luong,
        tong_tam_ung, thuc_linh
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        luong_co_so=VALUES(luong_co_so),
        tong_phu_cap=VALUES(tong_phu_cap),
        tong_thuong=VALUES(tong_thuong),
        tong_phat=VALUES(tong_phat),
        luong_theo_ngay_cong=VALUES(luong_theo_ngay_cong),
        tien_lam_them=VALUES(tien_lam_them),
        tong_luong=VALUES(tong_luong),
        tong_tam_ung=VALUES(tong_tam_ung),
        thuc_linh=VALUES(thuc_linh)
      `,
      [
        ma_nhan_vien,
        thang,
        nam,
        nv.luong_co_so,
        tong_phu_cap,
        tong_thuong,
        tong_phat,
        luong_theo_ngay_cong,
        tien_lam_them,
        tong_luong,
        tong_tam_ung,
        thuc_linh,
      ]
    );

    return { ma_nhan_vien, thang, nam, thuc_linh };
  },
};
