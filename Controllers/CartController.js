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
        let target = null;

        // Look inside cart for matching items to combine quantities
        for(let i = 0; i < cart.items.length; i++)
        {
            const existingItem = await CartItem.findById(cart.items[i]._id);

            if(existingItem.itemId.toString() === itemId)
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
            target.customs = customs;
            
            cart.items.push(newCartItem);
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