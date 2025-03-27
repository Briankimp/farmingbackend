const express = require("express");
const multer = require("multer");
const { uploadProduct, getAllProducts, getFarmerProducts } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Set up storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in "uploads/" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    }
});

const upload = multer({ storage });

// Routes
router.post("/upload", authMiddleware, upload.single("image"), uploadProduct);  // Upload product (Farmer only)
router.get("/", getAllProducts);  // Get all products (For vendors)
router.get("/my-products", authMiddleware, getFarmerProducts);  // Get logged-in farmer's products

module.exports = router;
