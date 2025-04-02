require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");

// Initialize express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: ['https://farming-platform-v5.vercel.app', 'http://localhost:3000'],
    credentials: true
}));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://farming-platform-v5.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    // Join a room with the user's ID
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
        try {
            // Emit to receiver's room
            io.to(data.receiverId).emit("receiveMessage", {
                ...data,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Socket sendMessage error:", error);
            socket.emit("error", { message: "Error sending message" });
        }
    });

    // Handle typing status
    socket.on("typing", (data) => {
        socket.to(data.receiverId).emit("userTyping", {
            senderId: data.senderId,
            isTyping: data.isTyping
        });
    });

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected:", socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Static files served from ${path.join(__dirname, "uploads")}`);
});
