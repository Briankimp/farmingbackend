const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize app
const app = express();
app.use(express.json());
//connect to MongoDB
connectDB();
app.get("/", (req, res) => {
  res.send("Building FarmConnect!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});