const express = require("express");
const router = express.Router();

router.use("/chucvu", require("./chucvuRoutes"));
router.use("/bangluong", require("./bangluongRoutes"));

module.exports = router;
