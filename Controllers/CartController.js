const Cart = require("../Models/Cart");
const Order = require("../Models/Order");
const MenuItem = require("../Models/MenuItem");

const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const CartItem = require("../Models/CartItem");
const cartHeader = "cartid"


const AddToCart = async (req, res) =>
{
    try
    {
        const cart = await GetCart(req,res);
        const newCartItem = new CartItem();

        newCartItem.cart = cart.id;
        newCartItem.itemId = req.body.itemId;
        newCartItem.quantity = req.body.qty;
        newCartItem.customs = req.body.customs;
        
        cart.items.push(newCartItem);
        await newCartItem.save();
        await cart.save();

        res.status(200).json(cart);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const GetCart = async (req, res) => 
{
    try
    {
        const cartId = req.headers[`${cartHeader}`];
        const target = await Cart.findById(cartId);

        if(target)
        {
            return target;
        }
        else
        {
            const newCart = new Cart();
            await newCart.save();
            return newCart;
        }
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

module.exports = {
    AddToCart,
}