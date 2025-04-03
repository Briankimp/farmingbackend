const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["admin", "farmer", "buyer"], 
        required: true 
    },
    avatar: {
        type: String,
        default: "/placeholder.svg?height=40&width=40"
    },
    location: {
        type: String,
        required: function() {
            return this.role === "farmer";
        }
    },
    phone: {
        type: String,
        required: function() {
            return this.role === "farmer";
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for search
UserSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model("User", UserSchema);