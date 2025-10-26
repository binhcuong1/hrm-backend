const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Route login duy nhất
router.post("/login", authController.login);

module.exports = router;