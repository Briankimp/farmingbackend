const express = require("express");
const { placeOrder, getVendorOrders, getFarmerOrders, updateOrderStatus } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/place", authMiddleware, placeOrder);  // Vendor places an order
router.get("/vendor", authMiddleware, getVendorOrders);  // Vendor views their orders
router.get("/farmer", authMiddleware, getFarmerOrders);  // Farmer views orders for their products
router.put("/update", authMiddleware, updateOrderStatus);  // Farmer updates order status

module.exports = router;
