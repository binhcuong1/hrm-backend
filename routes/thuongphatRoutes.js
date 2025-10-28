// routes/thuongphatRoutes.js
const express = require('express');
const router = express.Router();
const thuongphatController = require('../controllers/thuongphatController');

// RESTful
router.get('/', thuongphatController.getAll);
router.get('/:id', thuongphatController.getById);
router.post('/', thuongphatController.create);
router.put('/:id', thuongphatController.update);
router.delete('/:id', thuongphatController.remove);

module.exports = router;
