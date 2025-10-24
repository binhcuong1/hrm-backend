const express = require('express');
const router = express.Router();
const chucvuController = require('../controllers/chucvuController');

router.get('/', chucvuController.getAll);
router.get('/:id', chucvuController.getById);
router.post('/', chucvuController.create);
router.put('/:id', chucvuController.update);
router.delete('/:id', chucvuController.delete);

module.exports = router;