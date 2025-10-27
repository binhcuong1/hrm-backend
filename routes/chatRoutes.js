const router = require("express").Router();
const c = require("../controllers/chatController");

router.post("/start", c.start); // tạo conversation mới
router.patch("/:id/close", c.close); // đóng chat
router.get("/", c.list); // lấy danh sách
router.get("/:id/messages", c.history); // lấy lịch sử tin nhắn

module.exports = router;
