const express = require("express");
const router = express.Router();
const { protect, vendorOnly, farmerOnly } = require("../middleware/authMiddleware");
const orderController = require("../controllers/orderController");

// Debugging to check if the functions are properly imported
console.log("Order Controller:", orderController);
Object.keys(orderController).forEach(key => {
    console.log(`${key}: ${typeof orderController[key]}`);
});

// Validate that all required functions exist
const requiredFunctions = [
    'createOrder', 
    'getOrders', 
    'getOrderById', 
    'updateOrderStatus', 
    'cancelOrder'
];

const missingFunctions = requiredFunctions.filter(func => 
    typeof orderController[func] !== 'function'
);

if (missingFunctions.length > 0) {
    console.error(`❌ Missing order controller functions: ${missingFunctions.join(', ')}`);
    throw new Error(`Missing order controller functions: ${missingFunctions.join(', ')}`);
}

// Define routes using the validated controller functions
router.post("/create", protect, vendorOnly, orderController.createOrder);  
router.get("/", protect, orderController.getOrders);
router.get("/:orderId", protect, orderController.getOrderById);
router.put("/update", protect, farmerOnly, orderController.updateOrderStatus);
router.delete("/cancel/:orderId", protect, vendorOnly, orderController.cancelOrder);

module.exports = router;
