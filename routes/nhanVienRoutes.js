// routes/nhanVienRoutes.js
const express = require('express');
const ctrl = require('../controllers/nhanVienController');
const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.put('/restore/:id', ctrl.restore);

module.exports = router;
