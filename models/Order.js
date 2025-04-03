const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD-${Math.floor(Math.random() * 10000)}`
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    subtotal: {
        type: String,
        required: true
    },
    shipping: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    buyer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        }
    },
    farmer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    estimatedDelivery: {
        type: Date,
        required: true
    },
    completedDate: {
        type: Date
    },
    cancelReason: {
        type: String
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'M-Pesa']
    },
    shippingAddress: {
        type: String,
        required: true
    },
    trackingNumber: {
        type: String,
        unique: true,
        default: () => `TRK${Math.floor(Math.random() * 1000000)}`
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better query performance
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ 'buyer.id': 1 });
OrderSchema.index({ 'farmer.id': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ date: -1 });

module.exports = mongoose.model("Order", OrderSchema);
