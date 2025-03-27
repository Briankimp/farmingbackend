require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (images)
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.io real-time chat functionality
io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    socket.on("sendMessage", (data) => {
        io.to(data.receiverId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
