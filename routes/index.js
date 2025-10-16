const express = require('express');
const router = express.Router();

const chucvuRoutes = require('./chucvuRoutes');

router.use('/chucvu', chucvuRoutes);

module.exports = router;