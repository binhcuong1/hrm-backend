const express = require("express");
const router = express.Router();

const chucvuRoutes = require("./chucvuRoutes");
const bangluongRoutes = require("./bangluongRoutes");

router.use("/chucvu", chucvuRoutes);
router.use("/bangluong", bangluongRoutes);

module.exports = router;
