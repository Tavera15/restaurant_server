const mongoose = require("mongoose");
const User = require("./User");
const CartItem = require("./CartItem");


const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartItem"
        }
    ]
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;