const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const khuonmatController = require('../controllers/khuonmatController');

router.get('/', khuonmatController.getAll);
router.get('/:id', khuonmatController.getById);
router.post('/', khuonmatController.create);
router.put('/:id', khuonmatController.update);
router.delete('/:id', khuonmatController.delete);

// Đăng ký khuôn mặt (gọi Python /register)
router.post(
    '/register',
    upload.fields([{ name: 'front' }, { name: 'left' }, { name: 'right' }]),
    khuonmatController.registerFace
);

// Xác thực khuôn mặt (gọi Python /verify)
router.post(
    '/verify',
    upload.single('photo'),
    khuonmatController.verifyFace
);

module.exports = router;
