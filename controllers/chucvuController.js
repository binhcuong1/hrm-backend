const ChucVu = require('../models/chucvuModel');

exports.create = async (req, res) => {
    try {
        const id = await ChucVu.create(req.body); // { ten_chuc_vu, he_so_luong }
        res.status(201).json({ success: true, id });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ message: 'Chức vụ đã tồn tại' });
        console.error('POST /chucvu', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.getAll = async (_req, res) => {
    try {
        const rows = await ChucVu.getAll();
        res.json(rows);
    } catch (e) {
        console.error('GET /chucvu', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const row = await ChucVu.getById(req.params.id);
        if (!row) return res.status(404).json({ message: 'Chức vụ không tồn tại' });
        res.json(row);
    } catch (e) {
        console.error('GET /chucvu/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        await ChucVu.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        console.error('PUT /chucvu/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await ChucVu.delete(req.params.id);
        res.json({ success: true });
    } catch (e) {
        console.error('DELETE /chucvu/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};
