// controllers/calamviecController.js
const CaLamViec = require('../models/calamviecModel');

const CaLamViecController = {
  // 📋 GET all
  getAll: async (req, res) => {
    try {
      const data = await CaLamViec.getAll();
      res.json({ success: true, data });
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách ca làm việc:", error);
      res.status(500).json({ success: false, message: "Không thể tải danh sách ca làm việc" });
    }
  },

  add: async (req, res) => {
  try {
    console.log("📩 Body từ Flutter:", req.body);  // <--- thêm dòng này
    const { tenCa, gioBatDau, gioKetThuc, ngayLamViec } = req.body;

    if (!tenCa || !gioBatDau || !gioKetThuc || !ngayLamViec) {
      console.log("⚠️ Thiếu dữ liệu:", { tenCa, gioBatDau, gioKetThuc, ngayLamViec });
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu cần thiết" });
    }

    await CaLamViec.add({
      ten_ca: tenCa,
      gio_bat_dau: gioBatDau,
      gio_ket_thuc: gioKetThuc,
      ngay_lam_viec: ngayLamViec
    });

    res.status(201).json({ success: true, message: "✅ Thêm ca làm việc thành công" });
  } catch (error) {
    console.error("❌ Lỗi thêm ca làm việc:", error);
    res.status(500).json({ success: false, message: "Không thể thêm ca làm việc" });
  }
},


  // ✏️ PUT update
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { tenCa, gioBatDau, gioKetThuc, ngayLamViec } = req.body;

      if (!tenCa || !gioBatDau || !gioKetThuc) {
        return res.status(400).json({ success: false, message: "Thiếu dữ liệu cần thiết" });
      }

      await CaLamViec.update(id, {
        ten_ca: tenCa,
        gio_bat_dau: gioBatDau,
        gio_ket_thuc: gioKetThuc,
        ngay_lam_viec: ngayLamViec
      });

      res.json({ success: true, message: "✏️ Cập nhật ca làm việc thành công" });
    } catch (error) {
      console.error("❌ Lỗi cập nhật ca làm việc:", error);
      res.status(500).json({ success: false, message: "Không thể cập nhật ca làm việc" });
    }
  },

  // 🗑️ DELETE (soft)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await CaLamViec.delete(id);
      res.json({ success: true, message: "🗑️ Đã xóa ca làm việc" });
    } catch (error) {
      console.error("❌ Lỗi xóa ca làm việc:", error);
      res.status(500).json({ success: false, message: "Không thể xóa ca làm việc" });
    }
  },
};

module.exports = CaLamViecController;
