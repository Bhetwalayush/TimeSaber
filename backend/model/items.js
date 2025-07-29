

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    item_price: {
        type: Number,
        required: true
    },
    item_quantity: {
        type: Number,
        required: true
    },
    item_type: {
        type: String,
        required: true
    },
    sub_item_type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;


