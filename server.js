require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

// Authentication Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Product Routes
app.use("/api/products", require("./routes/productRoutes"));

app.get("/", (req, res) => {
    res.send("Welcome to the Fruit Market API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
