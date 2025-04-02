const Order = require("../models/Order");
const Product = require("../models/Product");

// Create a new order (Vendor Only)
exports.createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (quantity > product.quantity) {
            return res.status(400).json({ message: "Insufficient product quantity available." });
        }

        const totalPrice = product.price * quantity;

        const order = new Order({
            vendor: req.user._id,
            farmer: product.farmer,
            product: productId,
            quantity,
            totalPrice,
            status: 'pending'
        });

        // Update product quantity
        product.quantity -= quantity;
        await product.save();

        await order.save();
        
        const populatedOrder = await Order.findById(order._id)
            .populate('product', 'name price')
            .populate('farmer', 'name email')
            .populate('vendor', 'name email');

        res.status(201).json(populatedOrder);
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Server error while creating order." });
    }
};

// Get all orders for logged-in user
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            $or: [
                { vendor: req.user._id },
                { farmer: req.user._id }
            ]
        })
        .populate('product', 'name price')
        .populate('farmer', 'name email')
        .populate('vendor', 'name email')
        .sort('-createdAt');

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ message: "Server error while fetching orders." });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('product', 'name price')
            .populate('farmer', 'name email')
            .populate('vendor', 'name email');

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Check if user is authorized to view this order
        if (order.vendor.toString() !== req.user._id.toString() && 
            order.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this order." });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(500).json({ message: "Server error while fetching order." });
    }
};

// Update order status (Farmer Only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this order." });
        }

        if (!['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        order.status = status;
        
        // If order is rejected, restore product quantity
        if (status === 'rejected') {
            const product = await Product.findById(order.product);
            if (product) {
                product.quantity += order.quantity;
                await product.save();
            }
        }

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('product', 'name price')
            .populate('farmer', 'name email')
            .populate('vendor', 'name email');

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: "Server error while updating order status." });
    }
};

// Cancel order (Vendor Only)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order." });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Can only cancel pending orders." });
        }

        // Restore product quantity
        const product = await Product.findById(order.product);
        if (product) {
            product.quantity += order.quantity;
            await product.save();
        }

        await order.deleteOne();
        res.status(200).json({ message: "Order cancelled successfully." });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Server error while cancelling order." });
    }
};
