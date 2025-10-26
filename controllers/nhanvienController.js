const NhanVienModel = require('../models/nhanvienModel');

class NhanVienController {
    // Lấy tất cả nhân viên
    async getAll(req, res) {
        try {
            const nhanViens = await NhanVienModel.getAll();
            res.json({
                success: true,
                data: nhanViens
            });
        } catch (error) {
            console.error('Error getting employees:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách nhân viên',
                error: error.message
            });
        }
    }

    // Lấy nhân viên theo ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const nhanVien = await NhanVienModel.getById(id);

            if (!nhanVien) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            res.json({
                success: true,
                data: nhanVien
            });
        } catch (error) {
            console.error('Error getting employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin nhân viên',
                error: error.message
            });
        }
    }

    // Thêm nhân viên mới
    async create(req, res) {
        try {
            const { ma_chuc_vu, ma_phong_ban, ten_nhan_vien, email, sdt } = req.body;

            // Validate
            if (!ten_nhan_vien || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên và email là bắt buộc'
                });
            }

            // Kiểm tra email trùng
            const emailExists = await NhanVienModel.checkEmailExists(email);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }

            const newId = await NhanVienModel.create({
                ma_chuc_vu,
                ma_phong_ban,
                ten_nhan_vien,
                email,
                sdt
            });

            const newNhanVien = await NhanVienModel.getById(newId);

            res.status(201).json({
                success: true,
                message: 'Thêm nhân viên thành công',
                data: newNhanVien
            });
        } catch (error) {
            console.error('Error creating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm nhân viên',
                error: error.message
            });
        }
    }

    // Cập nhật nhân viên
    async update(req, res) {
        try {
            const { id } = req.params;
            const { ma_chuc_vu, ma_phong_ban, ten_nhan_vien, email, sdt } = req.body;

            // Validate
            if (!ten_nhan_vien || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên và email là bắt buộc'
                });
            }

            // Kiểm tra email trùng (trừ chính nó)
            const emailExists = await NhanVienModel.checkEmailExists(email, id);
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }

            const affectedRows = await NhanVienModel.update(id, {
                ma_chuc_vu,
                ma_phong_ban,
                ten_nhan_vien,
                email,
                sdt
            });

            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            const updatedNhanVien = await NhanVienModel.getById(id);

            res.json({
                success: true,
                message: 'Cập nhật nhân viên thành công',
                data: updatedNhanVien
            });
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật nhân viên',
                error: error.message
            });
        }
    }

    // Xóa nhân viên
    async delete(req, res) {
        try {
            const { id } = req.params;

            const affectedRows = await NhanVienModel.delete(id);

            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            res.json({
                success: true,
                message: 'Xóa nhân viên thành công'
            });
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa nhân viên',
                error: error.message
            });
        }
    }

    // Lấy danh sách chức vụ
    async getChucVu(req, res) {
        try {
            const chucVus = await NhanVienModel.getChucVu();
            res.json({
                success: true,
                data: chucVus
            });
        } catch (error) {
            console.error('Error getting positions:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách chức vụ',
                error: error.message
            });
        }
    }

    // Lấy danh sách phòng ban
    async getPhongBan(req, res) {
        try {
            const phongBans = await NhanVienModel.getPhongBan();
            res.json({
                success: true,
                data: phongBans
            });
        } catch (error) {
            console.error('Error getting departments:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách phòng ban',
                error: error.message
            });
        }
    }
}

module.exports = new NhanVienController();