const mongoose = require("mongoose");
const User = require("./User");
const MenuItem = require("./MenuItem");


const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MenuItem",
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
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
        }
    ],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;