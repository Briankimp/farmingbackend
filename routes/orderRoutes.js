const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, cancelOrder } = require("../controllers/orderController");
const { protect, vendorOnly } = require("../middleware/authMiddleware");

// Create order (Vendor only)
router.post("/create", protect, vendorOnly, createOrder);

// Get all orders for logged-in user
router.get("/", protect, getOrders);

// Get order by ID
router.get("/:orderId", protect, getOrderById);

// Update order status (Farmer only)
router.put("/update/:orderId", protect, updateOrderStatus);

// Cancel order (Vendor only)
router.delete("/cancel/:orderId", protect, vendorOnly, cancelOrder);

module.exports = router;
