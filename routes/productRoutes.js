const express = require("express");
const router = express.Router();
const { uploadProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, farmerOnly } = require("../middleware/authMiddleware");

// Upload product (Farmer only)
router.post("/upload", protect, farmerOnly, uploadProduct);

// Get all products
router.get("/", getProducts);

// Get product by ID
router.get("/:id", getProductById);

// Update product (Farmer only)
router.put("/edit/:id", protect, farmerOnly, updateProduct);

// Delete product (Farmer only)
router.delete("/delete/:id", protect, farmerOnly, deleteProduct);

module.exports = router;
