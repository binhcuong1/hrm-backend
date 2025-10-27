const db = require("../config/db");

module.exports = {
  async createConversation(user_id) {
    const [rs] = await db.query(
      `INSERT INTO conversations (user_id,status) VALUES (?, 'open')`,
      [user_id]
    );
    return rs.insertId;
  },

  async closeConversation(id) {
    await db.query(
      `UPDATE conversations SET status='closed', closed_at=NOW() WHERE id=?`,
      [id]
    );
  },

  async saveMessage(conversation_id, sender, text) {
    await db.query(
      `INSERT INTO messages (conversation_id,sender,text) VALUES (?,?,?)`,
      [conversation_id, sender, text]
    );
  },

  async getAllConversations() {
    const [rows] = await db.query(
      `SELECT * FROM conversations ORDER BY created_at DESC`
    );
    return rows;
  },

  async getMessagesByConversation(id) {
    const [rows] = await db.query(
      `SELECT * FROM messages WHERE conversation_id=? ORDER BY created_at ASC`,
      [id]
    );
    return rows;
  },
};
