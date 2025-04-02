const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    vendor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: [true, "Vendor is required"]
    },
    farmer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: [true, "Farmer is required"]
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: [true, "Product is required"]
    },
    quantity: { 
        type: Number, 
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"]
    },
    totalPrice: { 
        type: Number, 
        required: [true, "Total price is required"],
        min: [0, "Total price cannot be negative"]
    },
    status: { 
        type: String, 
        enum: {
            values: ["pending", "accepted", "rejected", "completed"],
            message: "{VALUE} is not a valid status"
        },
        default: "pending"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add index for better query performance
OrderSchema.index({ vendor: 1, createdAt: -1 });
OrderSchema.index({ farmer: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
