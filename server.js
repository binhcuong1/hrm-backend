const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./models/chatModel");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
require("./config/db");

const router = require("./routes/index");

// Cấu hình CORS
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Lấy thông tin từ file .env
require("dotenv").config();

app.use(express.json()); // Bật tính năng đọc JSON
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Backend đang chạy");
});

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("send_message", async (data) => {
    // data = { conversation_id, sender, text }
    await Chat.saveMessage(data.conversation_id, data.sender, data.text);
    io.to(data.conversation_id.toString()).emit("receive_message", data);
  });

  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server + Socket chạy tại http://127.0.0.1:${PORT}`);
});
