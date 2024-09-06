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
        const {itemId, qty, customs} = req.body;
        const newCustoms = JSON.stringify(customs);
        let target = null;

        // Look inside cart for matching items to combine quantities
        for(let i = 0; i < cart.items.length; i++)
        {
            const existingItem = await CartItem.findById(cart.items[i]._id);

            if(existingItem.itemId.toString() === itemId && existingItem.customs === newCustoms)
            {
                target = existingItem;
                break;
            }
        }

        if(target !== null)
        {
            // If match found, combine quantities....
            target.quantity += qty;
        }
        else
        {
            // ...else create new cart item object
            target = new CartItem();
            target.cart = cart.id;
            target.itemId = itemId;
            target.quantity = qty;
            target.customs = newCustoms;
            
            cart.items.push(target);
        }
        
        await target.save();
        await cart.save();

        res.status(200).json(cart);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const ClearCart = async (req, res) => 
{
    try
    {
        const cart = await GetCart(req,res);

        for(let i = 0; i < cart.items.length; i++)
        {
            const target = await CartItem.findById(cart.items[i]._id);
            await CartItem.deleteOne(target);
        }

        cart.items = [];
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
    ClearCart,
}