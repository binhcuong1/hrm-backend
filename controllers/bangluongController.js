const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const BangLuong = require("../models/bangluongModel");

// ========================
// 1️⃣ Tính lương tất cả nhân viên
// ========================
exports.calcAll = async (req, res) => {
    const { thang, nam } = req.body;
    try {
        const [nhanviens] = await db.query(`SELECT ma_nhan_vien FROM nhan_vien`);
        const results = [];
        for (const nv of nhanviens) {
            try {
                const data = await BangLuong.calcSalary(nv.ma_nhan_vien, thang, nam);
                results.push({ ...data, status: "OK" });
            } catch (err) {
                results.push({ ma_nhan_vien: nv.ma_nhan_vien, error: err.message });
            }
        }
        res.json({ success: true, message: "Tính lương hoàn tất", data: results });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// ========================
// 2️⃣ Lấy danh sách bảng lương tháng
// ========================
exports.getByMonth = async (req, res) => {
    const { thang, nam } = req.params;
    try {
        const [rows] = await db.query(
            `
      SELECT 
        nv.ma_nhan_vien,
        nv.ten_nhan_vien,
        pb.ten_phong_ban,
        (bl.luong_theo_ngay_cong + bl.tong_phu_cap + bl.tong_thuong + bl.tien_lam_them) AS tong_luong,
        (bl.tong_phat + bl.tong_tam_ung) AS khau_tru,
        bl.thuc_linh,
        bl.da_chot
      FROM bang_luong bl
      JOIN nhan_vien nv ON nv.ma_nhan_vien = bl.ma_nhan_vien
      JOIN phong_ban pb ON pb.ma_phong_ban = nv.ma_phong_ban
      WHERE bl.thang=? AND bl.nam=?
      ORDER BY nv.ten_nhan_vien ASC
    `,
            [thang, nam]
        );
        res.json({ success: true, thang, nam, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// ========================
// 3️⃣ Lấy chi tiết lương 1 nhân viên
// ========================
exports.getPayrollDetail = async (req, res) => {
    const { nhanvien, thang, nam } = req.params;
    try {
        const [[luong]] = await db.query(
            `
      SELECT 
        nv.ten_nhan_vien,
        pb.ten_phong_ban,
        cv.ten_chuc_vu,
        bl.*
      FROM bang_luong bl
      JOIN nhan_vien nv ON nv.ma_nhan_vien = bl.ma_nhan_vien
      JOIN phong_ban pb ON pb.ma_phong_ban = nv.ma_phong_ban
      JOIN chuc_vu cv ON cv.ma_chuc_vu = nv.ma_chuc_vu
      WHERE bl.ma_nhan_vien=? AND bl.thang=? AND bl.nam=?`,
            [nhanvien, thang, nam]
        );

        const [thuongPhat] = await db.query(
            `
      SELECT DATE_FORMAT(ngay, '%d/%m/%Y') AS ngay, loai_tp, so_tien, ly_do
      FROM thuong_phat
      WHERE ma_nhan_vien=? AND MONTH(ngay)=? AND YEAR(ngay)=?
    `,
            [nhanvien, thang, nam]
        );

        res.json({ success: true, data: { ...luong, thuong_phat: thuongPhat } });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// ========================
// 4️⃣ Chốt lương tháng
// ========================
exports.lockMonth = async (req, res) => {
    const { thang, nam } = req.body;
    try {
        await db.query(`UPDATE bang_luong SET da_chot=1 WHERE thang=? AND nam=?`, [
            thang,
            nam,
        ]);
        res.json({ success: true, message: `Đã chốt lương tháng ${thang}/${nam}` });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

// ===========================
// 📤 EXPORT BẢNG LƯƠNG (EXCEL)
// ===========================
exports.exportPayroll = async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const thangNum = parseInt(thang);
        const namNum = parseInt(nam);

        // ✅ Lấy dữ liệu bảng lương join thông tin nhân viên
        const [rows] = await db.query(
            `
      SELECT 
        bl.*, 
        nv.ten_nhan_vien, 
        cv.ten_chuc_vu, 
        pb.ten_phong_ban
      FROM bang_luong bl
      JOIN nhan_vien nv ON bl.ma_nhan_vien = nv.ma_nhan_vien
      JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
      JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
      WHERE bl.thang = ? AND bl.nam = ?
      ORDER BY pb.ten_phong_ban, nv.ten_nhan_vien
    `,
            [thangNum, namNum]
        );

        if (!rows.length)
            return res
                .status(404)
                .json({ message: "Không có dữ liệu bảng lương cho tháng/năm này." });

        // ✅ Tạo thư mục exports nếu chưa có
        const exportDir = path.join(__dirname, "../exports");
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        // ✅ Tạo workbook + worksheet
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(`Luong_${thang}_${nam}`);

        // 🧭 Tiêu đề
        sheet.mergeCells("A1:H1");
        sheet.getCell("A1").value = `BẢNG LƯƠNG THÁNG ${thang}/${nam}`;
        sheet.getCell("A1").alignment = {
            horizontal: "center",
            vertical: "middle",
        };
        sheet.getCell("A1").font = {
            bold: true,
            size: 16,
            color: { argb: "004B8B" },
        };

        // 🧾 Header
        const headers = [
            "STT",
            "Họ tên nhân viên",
            "Chức vụ",
            "Phòng ban",
            "Tổng lương (₫)",
            "Khấu trừ (₫)",
            "Thực lĩnh (₫)",
        ];
        sheet.addRow(headers);

        // Format header
        const headerRow = sheet.getRow(2);
        headerRow.font = { bold: true, size: 12, color: { argb: "000000" } };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDCE6F1" },
        };

        // 📊 Thêm dữ liệu từng nhân viên
        rows.forEach((r, index) => {
            // Tính tổng khấu trừ (phạt + tạm ứng)
            const khauTru = (r.tong_phat || 0) + (r.tong_tam_ung || 0);

            sheet.addRow([
                index + 1,
                r.ten_nhan_vien,
                r.ten_chuc_vu,
                r.ten_phong_ban,
                r.tong_luong,
                -Math.abs(khauTru), // ✅ hiển thị dấu âm
                r.thuc_linh,
            ]);
        });

        // 📈 Định dạng tiền & border
        sheet.eachRow((row, rowIndex) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                cell.alignment = { vertical: "middle", horizontal: "center" };
            });

            // format tiền
            if (rowIndex > 2) {
                row.getCell(5).numFmt = "#,##0 [$₫-vi-VN]";
                row.getCell(6).numFmt = "#,##0 [$₫-vi-VN]";
                row.getCell(7).numFmt = "#,##0 [$₫-vi-VN]";

                // ✅ nếu khấu trừ âm → tô màu đỏ
                const khauTruCell = row.getCell(6);
                if (khauTruCell.value < 0) {
                    khauTruCell.font = { color: { argb: "FFFF0000" }, bold: true };
                }
            }
        });

        // 🧮 Dòng tổng cộng cuối bảng
        const totalRow = sheet.addRow([
            "",
            "",
            "",
            "Tổng cộng:",
            { formula: `SUM(E3:E${rows.length + 2})` },
            { formula: `SUM(F3:F${rows.length + 2})` },
            { formula: `SUM(G3:G${rows.length + 2})` },
        ]);
        totalRow.font = { bold: true };
        totalRow.getCell(4).alignment = { horizontal: "right" };
        totalRow.eachCell((cell) => {
            cell.border = {
                top: { style: "double" },
                bottom: { style: "double" },
                left: { style: "thin" },
                right: { style: "thin" },
            };
            cell.numFmt = "#,##0 [$₫-vi-VN]";
        });

        // 📏 Căn chỉnh độ rộng
        const widths = [8, 25, 20, 22, 18, 18, 18];
        widths.forEach((w, i) => (sheet.getColumn(i + 1).width = w));

        // ✅ Ghi file
        const filePath = path.join(exportDir, `bangluong_${thang}_${nam}.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        console.log("✅ Xuất Excel:", filePath);

        // ✅ Tải về
        return res.download(filePath);
    } catch (err) {
        console.error("❌ exportPayroll error:", err);
        res.status(500).json({ message: "Lỗi khi xuất bảng lương." });
    }
};

exports.sendPayrollEmail = async (req, res) => {
    try {
        const { thang, nam } = req.body;

        // ✅ Lấy dữ liệu lương từng nhân viên
        const [rows] = await db.query(
            `
      SELECT 
        nv.email,
        nv.ten_nhan_vien,
        cv.ten_chuc_vu,
        pb.ten_phong_ban,
        bl.*
      FROM bang_luong bl
      JOIN nhan_vien nv ON bl.ma_nhan_vien = nv.ma_nhan_vien
      JOIN chuc_vu cv ON nv.ma_chuc_vu = cv.ma_chuc_vu
      JOIN phong_ban pb ON nv.ma_phong_ban = pb.ma_phong_ban
      WHERE bl.thang = ? AND bl.nam = ? AND nv.email IS NOT NULL
    `,
            [thang, nam]
        );

        if (!rows.length)
            return res.status(404).json({ message: "Không có dữ liệu để gửi email" });

        // ✅ Cấu hình mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // ✅ Gửi mail từng nhân viên
        for (const r of rows) {
            // ✅ Lấy số ngày công thực tế
            // ✅ Lấy số ngày công thực tế từ bảng cham_cong (tháng/năm)
            const [[workdays]] = await db.query(
                `
  SELECT COALESCE(songaycong_thucte, 0) AS so_ngay_cong
  FROM cham_cong
  WHERE ma_nhan_vien = ? AND thang = ? AND nam = ?
  LIMIT 1
`,
                [r.ma_nhan_vien, thang, nam]
            );

            const soNgayCong = Number(workdays?.so_ngay_cong || 0);

            // Nếu bang_luong đã có luong_theo_ngay_cong thì dùng luôn cho khớp sổ lương
            const luongTheoCong =
                r.luong_theo_ngay_cong != null
                    ? Number(r.luong_theo_ngay_cong)
                    : (Number(r.luong_co_so || 0) / 26) * soNgayCong;

            // ✅ Lấy chi tiết thưởng/phạt
            const [tp] = await db.query(
                `
  SELECT loai_tp, so_tien, ly_do, DATE_FORMAT(ngay, '%d/%m/%Y') AS ngay
  FROM thuong_phat
  WHERE ma_nhan_vien = ? AND MONTH(ngay) = ? AND YEAR(ngay) = ?
`,
                [r.ma_nhan_vien, thang, nam]
            );

            // ✅ Lấy chi tiết phụ cấp
            const [pc] = await db.query(
                `
  SELECT pc.ten_phu_cap, pc.so_tien, DATE_FORMAT(ct.ngay_bat_dau, '%d/%m/%Y') AS ngay_bat_dau
  FROM ct_phu_cap ct
  JOIN phu_cap pc ON ct.ma_phu_cap = pc.ma_phu_cap
  WHERE ct.ma_nhan_vien = ?
`,
                [r.ma_nhan_vien]
            );

            // format tiền
            const fmt = (n) =>
                Number(n || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                });

            // ===== HTML email (đÃ bỏ Bảo hiểm 10.5%) =====
            const html = `
<div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 14px;">
  <h2 style="text-align:center;">PHIẾU LƯƠNG</h2>
  <h3 style="text-align:center;">Tháng ${thang}/${nam}</h3>
  <table width="100%" style="margin-bottom:20px;">
    <tr><td><b>Họ và tên:</b></td><td>${r.ten_nhan_vien}</td></tr>
    <tr><td><b>Mã nhân viên:</b></td><td>${r.ma_nhan_vien}</td></tr>
    <tr><td><b>Phòng ban:</b></td><td>${r.ten_phong_ban}</td></tr>
    <tr><td><b>Chức vụ:</b></td><td>${r.ten_chuc_vu}</td></tr>
    <tr><td><b>Email:</b></td><td>${r.email}</td></tr>
  </table>

  <h4 style="background:#004b8b;color:white;padding:6px;">NỘI DUNG CHI TIẾT</h4>
  <table border="1" cellspacing="0" cellpadding="6" width="100%" style="border-collapse:collapse;">
    <tr style="background-color:#f2f2f2;font-weight:bold;">
      <td>Mục</td><td align="right">Số tiền (₫)</td>
    </tr>
    <tr><td>Lương cơ bản theo ngày công (${soNgayCong} ngày)</td><td align="right">${fmt(
                luongTheoCong
            )}</td></tr>
    <tr><td>Tổng phụ cấp</td><td align="right">${fmt(r.tong_phu_cap)}</td></tr>
    <tr><td>Tổng thưởng</td><td align="right">${fmt(r.tong_thuong)}</td></tr>
    <tr><td>Tổng phạt</td><td align="right">${fmt(r.tong_phat)}</td></tr>
    <tr><td>Tổng tạm ứng</td><td align="right">${fmt(r.tong_tam_ung)}</td></tr>
    <tr style="background-color:#e8ffe8;font-weight:bold;">
      <td>Thực lãnh</td>
      <td align="right" style="color:green;">${fmt(r.thuc_linh)}</td>
    </tr>
  </table>

  ${tp.length
                    ? `
  <h4>Chi tiết thưởng / phạt:</h4>
  <table border="1" cellspacing="0" cellpadding="6" width="100%" style="border-collapse:collapse;margin-bottom:20px;">
    <tr style="background:#f2f2f2;font-weight:bold;">
      <td>Loại</td><td>Lý do</td><td align="right">Số tiền</td><td>Ngày</td>
    </tr>
    ${tp
                        .map(
                            (t) =>
                                `<tr><td>${t.loai_tp}</td><td>${t.ly_do || ""
                                }</td><td align="right">${fmt(t.so_tien)}</td><td>${t.ngay}</td></tr>`
                        )
                        .join("")}
  </table>`
                    : ""
                }

  ${pc.length
                    ? `
  <h4>Chi tiết phụ cấp:</h4>
  <table border="1" cellspacing="0" cellpadding="6" width="100%" style="border-collapse:collapse;">
    <tr style="background:#f2f2f2;font-weight:bold;">
      <td>Tên phụ cấp</td><td align="right">Số tiền</td><td>Ngày bắt đầu</td>
    </tr>
    ${pc
                        .map(
                            (p) =>
                                `<tr><td>${p.ten_phu_cap}</td><td align="right">${fmt(
                                    p.so_tien
                                )}</td><td>${p.ngay_bat_dau}</td></tr>`
                        )
                        .join("")}
  </table>`
                    : ""
                }

  <p style="margin-top:20px;font-style:italic;">
    Vui lòng phản hồi email này nếu có sai sót trước <b>18h00 ngày ${new Date().getDate() + 2
                }/${thang}/${nam}</b>.<br>
    Nhân viên không được thảo luận về lương với đồng nghiệp.
  </p>

  <p>Trân trọng,<br><b>Phòng nhân sự</b></p>
</div>`;

            // ✅ Gửi mail
            const mailOptions = {
                from: `"Phòng nhân sự" <${process.env.MAIL_USER}>`,
                to: r.email,
                subject: `Bảng lương tháng ${thang}/${nam}`,
                html,
            };

            await transporter.sendMail(mailOptions);
            console.log(`📧 Đã gửi bảng lương cho: ${r.ten_nhan_vien}`);
        }

        res.json({
            success: true,
            message: "Đã gửi email chi tiết cho nhân viên.",
        });
    } catch (err) {
        console.error("❌ sendPayrollEmail error:", err);
        res.status(500).json({ message: "Lỗi khi gửi email chi tiết." });
    }
};