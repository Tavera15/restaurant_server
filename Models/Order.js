const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    orderNumber: {
        type: String,
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    customer_delivery: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
    },
    cart: [
        {
            menuItemId: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    grand_total: {
        type: Number,
        required: true,
        min: 0.01
    },
    status: {
        type: String,
        enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    },
})

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;