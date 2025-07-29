const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
