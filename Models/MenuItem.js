const mongoose = require("mongoose");
const Category = require("./Category");

const MenuItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        min: 0.00,
        required: true,
        required: "A price greater than 0.00 is required"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category',
        required: true
    }
})

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
module.exports = MenuItem;