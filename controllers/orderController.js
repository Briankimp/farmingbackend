const Order = require("../models/Order");
const Product = require("../models/Product");

// Place an Order (Vendor Only)
exports.placeOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Calculate total price
        const totalPrice = product.price * quantity;

        // Create new order
        const order = new Order({
            vendor: req.user.id,
            farmer: product.farmer,
            product: productId,
            quantity,
            totalPrice
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully!", order });

    } catch (error) {
        res.status(500).json({ error: "Error placing order." });
    }
};

// Get Orders for a Vendor
exports.getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ vendor: req.user.id })
            .populate("product", "name price")
            .populate("farmer", "name email");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Error fetching vendor orders." });
    }
};

// Get Orders for a Farmer
exports.getFarmerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ farmer: req.user.id })
            .populate("product", "name price")
            .populate("vendor", "name email");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Error fetching farmer orders." });
    }
};

// Update Order Status (Farmer Only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Verify the order belongs to this farmer
        if (order.farmer.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this order" });
        }

        order.status = status;
        await order.save();

        res.json({ message: "Order status updated successfully!", order });
    } catch (error) {
        res.status(500).json({ error: "Error updating order status." });
    }
};
