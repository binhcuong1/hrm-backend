const Chat = require("../models/chatModel");

exports.start = async (req, res) => {
  const { user_id } = req.body;
  const id = await Chat.createConversation(user_id);
  return res.json({ success: true, conversation_id: id });
};

exports.close = async (req, res) => {
  await Chat.closeConversation(req.params.id);
  return res.json({ success: true });
};

exports.list = async (req, res) => {
  const rows = await Chat.getAllConversations();
  return res.json(rows);
};

exports.history = async (req, res) => {
  const rows = await Chat.getMessagesByConversation(req.params.id);
  return res.json(rows);
};
