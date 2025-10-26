const NhanVien = require('../models/nhanvienModel');

exports.create = async (req, res) => {
    try {
        const id = await NhanVien.create(req.body); // expects ma_chuc_vu, ma_phong_ban, ten_nhan_vien, email?, sdt?
        res.status(201).json({ success: true, id });
    } catch (e) {
        if (e.code === 'ER_NO_REFERENCED_ROW_2' || e.code === 'ER_NO_REFERENCED_ROW')
            return res.status(400).json({ message: 'Tham chiếu không hợp lệ (chức vụ/phòng ban)' });
        console.error('POST /nhan-vien', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.getAll = async (_req, res) => {
    try {
        const rows = await NhanVien.getAll();
        res.json(rows);
    } catch (e) {
        console.error('GET /nhan-vien', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const row = await NhanVien.getById(req.params.id);
        if (!row) return res.status(404).json({ message: 'Nhân viên không tồn tại' });
        res.json(row);
    } catch (e) {
        console.error('GET /nhan-vien/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        await NhanVien.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        console.error('PUT /nhan-vien/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await NhanVien.delete(req.params.id);
        res.json({ success: true });
    } catch (e) {
        console.error('DELETE /nhan-vien/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};
