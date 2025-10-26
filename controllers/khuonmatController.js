const axios = require('axios');
const FormData = require('form-data');
const KhuonMat = require('../models/khuonmatModel');

const FACE_API_URL = process.env.FACE_API_URL || 'http://localhost:8000';

exports.create = async (req, res) => {
    try {
        const id = await KhuonMat.create(req.body); // { ma_nhan_vien, ten_file_json, duong_dan }
        res.status(201).json({ success: true, id });
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY')
            return res.status(409).json({ message: 'Nhân viên đã có bản ghi khuôn mặt' });
        console.error('POST /khuon-mat', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.getAll = async (_req, res) => {
    try {
        const rows = await KhuonMat.getAll();
        res.json(rows);
    } catch (e) {
        console.error('GET /khuon-mat', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const row = await KhuonMat.getById(req.params.id);
        if (!row) return res.status(404).json({ message: 'Không tồn tại bản ghi' });
        res.json(row);
    } catch (e) {
        console.error('GET /khuon-mat/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        await KhuonMat.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        console.error('PUT /khuon-mat/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await KhuonMat.delete(req.params.id);
        res.json({ success: true });
    } catch (e) {
        console.error('DELETE /khuon-mat/:id', e);
        res.status(500).json({ message: 'Server error', detail: e.message });
    }
};

// ---------- Proxy Python: /register ----------
exports.registerFace = async (req, res) => {
    try {
        const { ma_nhan_vien } = req.body;
        if (!ma_nhan_vien || !req.files?.front || !req.files?.left || !req.files?.right) {
            return res.status(400).json({ message: 'Thiếu ma_nhan_vien hoặc ảnh front/left/right' });
        }

        const fd = new FormData();
        fd.append('user_id', String(ma_nhan_vien));
        fd.append('front', req.files.front[0].buffer, { filename: 'front.jpg' });
        fd.append('left', req.files.left[0].buffer, { filename: 'left.jpg' });
        fd.append('right', req.files.right[0].buffer, { filename: 'right.jpg' });

        const pyRes = await axios.post(`${FACE_API_URL}/register`, fd, {
            headers: fd.getHeaders(),
            timeout: 20000
        });

        // Theo python server, file sẽ là data/{user_id}.json
        if (pyRes.data?.ok) {
            const ten_file_json = `${ma_nhan_vien}.json`;
            const duong_dan = `data/${ten_file_json}`;
            // Upsert bản ghi trong DB
            await KhuonMat.upsertByNhanVien({
                ma_nhan_vien: Number(ma_nhan_vien),
                ten_file_json,
                duong_dan
            });
        }

        res.json(pyRes.data);
    } catch (e) {
        console.error('POST /khuon-mat/register', e?.response?.data || e);
        res.status(502).json({ message: 'Face API error', detail: e.message });
    }
};

// ---------- Proxy Python: /verify ----------
exports.verifyFace = async (req, res) => {
    try {
        const { ma_nhan_vien } = req.body;
        if (!ma_nhan_vien || !req.file) {
            return res.status(400).json({ message: 'Thiếu ma_nhan_vien hoặc ảnh photo' });
        }

        const fd = new FormData();
        fd.append('user_id', String(ma_nhan_vien));
        fd.append('photo', req.file.buffer, { filename: 'photo.jpg' });

        const pyRes = await axios.post(`${FACE_API_URL}/verify`, fd, {
            headers: fd.getHeaders(),
            timeout: 15000
        });

        res.json(pyRes.data); // { ok, similarity }
    } catch (e) {
        console.error('POST /khuon-mat/verify', e?.response?.data || e);
        res.status(502).json({ message: 'Face API error', detail: e.message });
    }
};
