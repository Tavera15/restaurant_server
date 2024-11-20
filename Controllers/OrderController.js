const Order = require("../Models/Order");
const User = require("../Models/User");
const MenuItem = require("../Models/MenuItem");
const Cart = require("../Models/Cart");

const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const CartItem = require("../Models/CartItem");

const GetOrders = async (req, res) =>
{
    try
    {
        const target = await Order.find();

        res.status(200).json(target);
    }
    catch
    {
        res.status(500).json(res.message);
    }
}

const PlaceOrder = async (req, res) =>
{
    try
    {
        // const user = await User.findById(req.userId);
        const {customer_delivery, cartId} = req.body;
        let grand_total = 0.00;
        const target = await Cart.findById(cartId);
        const cart = [];

        for(let i in target.items)
        {
            const item = target.items[i];
            const cartItem = await CartItem.findById(item._id.toString());
            const menuItem = await MenuItem.findById(cartItem.itemId);
            
            if(!menuItem) {throw new EntityNotFoundError(`${item.name} was not found`)}
            
            cart.push(item);
            grand_total += (menuItem.price * cartItem.quantity);
        }
        
        const newOrder = new Order({customer_delivery, cart, grand_total: Number.parseFloat(grand_total.toFixed(2)), status: "placed"});
        await newOrder.save();

        res.status(200).json(newOrder);
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json(err.message);
    }
}

module.exports = {
    GetOrders,
    PlaceOrder,
}