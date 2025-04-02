const Message = require("../models/Message");
const User = require("../models/User");

// Send a Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ message: "Receiver ID and message content are required." });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        const newMessage = new Message({
            sender: req.user._id,
            receiver: receiverId,
            content,
            timestamp: new Date()
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name')
            .populate('receiver', 'name');

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: "Error sending message." });
    }
};

// Get Messages for a Conversation
exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        if (!conversationId) {
            return res.status(400).json({ message: "Conversation ID is required." });
        }

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: conversationId },
                { sender: conversationId, receiver: req.user._id }
            ]
        })
        .populate('sender', 'name')
        .populate('receiver', 'name')
        .sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).json({ message: "Error fetching messages." });
    }
};

// Get Chat History
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Get all unique conversations for the current user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { receiver: req.user._id }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", req.user._id] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        // Populate user details
        const populatedConversations = await User.populate(conversations, {
            path: "_id",
            select: "name email"
        });

        res.status(200).json(populatedConversations);
    } catch (error) {
        console.error("Get Chat History Error:", error);
        res.status(500).json({ message: "Error fetching chat history." });
    }
};
