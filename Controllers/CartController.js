const Cart = require("../Models/Cart");
const CartItem = require("../Models/CartItem");
const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const cartHeader = "cartid"

const AddToCart = async (req, res) =>
{
    try
    {
        const cart = await GetCart(req, res);

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
        console.log(req.body);

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
        console.log(err);
        res.status(500).json(err.message);
    }
}

const DeleteItem = async (req, res) => 
{
    try
    {
        res.status(200).json({_id: "deleteitem"});
        return;
        const cart = await GetCart(req,res);
        const {targetId} = req.body;
        const target = await CartItem.findById(targetId);

        const targetExist = target !== undefined && cart.items.find(i => i._id.toString() === targetId.toString()) !== undefined;

        if(targetExist)
        {
            cart.items.pull(targetId);
            
            await CartItem.deleteOne(target)
            await cart.save();
            res.status(200).json(cart);
        }
        else
        {
            throw new EntityNotFoundError("Item not in cart");
        }
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const UpdateItem = async (req, res) => 
{
    res.status(200).json({_id: "updateitem"});
        return;
    try
    {
        const cart = await GetCart(req,res);
        const {targetId, qty, customs} = req.body;
        const target = await CartItem.findById(targetId);

        const targetExist = target !== undefined && cart.items.find(i => i._id.toString() === targetId.toString()) !== undefined;

        if(targetExist)
        {
            target.quantity = qty;
            target.customs = JSON.stringify(customs);

            await target.save();
            await cart.save();

            res.status(200).json(cart);
        }
        else
        {
            throw new EntityNotFoundError("Cart item not found");
        }
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
        const cartId = req.body[cartHeader];
        const target = await Cart.findById(cartId);

        if(target)
        {
            console.log(target)
            return target;
        }
        else
        {
            const newCart = new Cart();
            await newCart.save();

            console.log(newCart)
            return newCart;
        }
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const GetCartItems = async (req, res) => 
{
    try
    {
        const cartId = req.query.cartid;
        const target = await Cart.findById(cartId);

        if(target)
        {
            res.status(200).json(target)
        }
        else
        {
            const newCart = new Cart();
            await newCart.save();

            res.status(200).json(newCart);
        }
    }
    catch(err)
    {
        res.status(500).json([]);
    }
}

module.exports = {
    GetCart,
    GetCartItems,
    AddToCart,
    UpdateItem,
    ClearCart,
    DeleteItem
}