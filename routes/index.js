const express = require("express");
const router = express.Router();

router.use("/bangluong", require("./bangluongRoutes"));
router.use("/chucvu", require("./chucvuRoutes"));
router.use("/khuon-mat", require("./khuonmatRoutes"));
router.use("/nhan-vien", require("./nhanvienRoutes"));
router.use("/auth", require("./authRoutes"));
router.use("/calamviec", require("./calamviecRoutes"));
router.use("/phongban", require("./phongbanRoutes"));
router.use("/thuongphat", require("./thuongPhatRoutes"));
router.use("/bangluong", require("./bangluongRoutes"));
router.use("/chat", require("./chatRoutes"));

module.exports = router;
