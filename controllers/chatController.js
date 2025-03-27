const Message = require("../models/Message");

// Send a Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        // Create new message
        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            message
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully!", newMessage });

    } catch (error) {
        res.status(500).json({ error: "Error sending message." });
    }
};

// Get Messages Between Two Users
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;  // ID of the user we are chatting with

        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages." });
    }
};
