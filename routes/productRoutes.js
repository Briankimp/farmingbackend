const express = require("express");
const router = express.Router();
const { uploadProduct, getAllProducts, getFarmerProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, farmerOnly } = require("../middleware/authMiddleware");
const multer = require("multer");

//configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Make sure the `uploads/` folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Ensure this route follows RESTful API best practices
 


// Upload product (Farmer only)
router.post("/upload", upload.single("image"), protect, farmerOnly, uploadProduct);

// Get all products
router.get("/", getAllProducts);

// Get farmer's products
router.get("/farmer", protect, farmerOnly, getFarmerProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product (Farmer only)
router.put("/edit/:id", protect, farmerOnly, updateProduct);

// Delete product (Farmer only)
router.delete("/delete/:id", protect, farmerOnly, deleteProduct);

module.exports = router;
