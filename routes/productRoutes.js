const express = require("express");
const router = express.Router();
const { uploadProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, farmerOnly } = require("../middleware/authMiddleware");

const { createProduct } = require("../controllers/productController");

// Ensure this route follows RESTful API best practices
router.post("/", createProduct); // POST /api/products  


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
