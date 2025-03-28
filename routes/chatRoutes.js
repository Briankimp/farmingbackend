const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// Send message
router.post("/send", protect, sendMessage);

// Get messages for a conversation
router.get("/:conversationId", protect, getMessages);

// Get chat history with a user
router.get("/history/:userId", protect, getChatHistory);

module.exports = router;
