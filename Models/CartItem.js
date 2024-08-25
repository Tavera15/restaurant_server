const mongoose = require("mongoose");
const User = require("./User");
const MenuItem = require("./MenuItem");


const CartItemSchema = mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    customs: [
        {
            listName: {
                type: String
            },
            selections: [String]
        }
    ]
});

const CartItem = mongoose.model("CartItem", CartItemSchema);
module.exports = CartItem;