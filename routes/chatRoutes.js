const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/send", authMiddleware, sendMessage); // Send a message
router.get("/:userId", authMiddleware, getMessages); // Get messages between two users

module.exports = router;
