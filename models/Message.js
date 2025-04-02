const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receiver is required']
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
        maxlength: [1000, 'Message cannot be longer than 1000 characters']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });
messageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);
