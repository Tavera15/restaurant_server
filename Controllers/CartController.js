const Cart = require("../Models/Cart");
const CartItem = require("../Models/CartItem");
const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const MenuItem = require("../Models/MenuItem");
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
        cart.total = await getCartTotal(cart);
        await cart.save();

        res.status(200).json(cart);
    }
    catch(err)
    {
        console.log(err)
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
        cart.total = 0.00;
        await cart.save();
        
        res.status(200).json(cart);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const GetSingleCartItem = async (req, res) => 
{
    try
    {
        const targetId = req.query.cartItemId;
        let target = null;

        const cartId = req.query.cartid;
        const cart = await Cart.findById(cartId);

        if(!cart)
        {
            throw new EntityNotFoundError("Cart Not Found");
        }

        for(let i = 0; i < cart.items.length; i++)
        {
            if(cart.items[i]._id.toString() === targetId)
            {
                target = await CartItem.findById(cart.items[i]);
                break;
            }
        }
        
        if(!target)
        {
            throw new EntityNotFoundError("Cart Item Not Found");
        }

        const menuItem = await MenuItem.findById(target.itemId);
        res.status(200).json({target, menuItem});
    }
    catch(err)
    {
        res.status(500).json(err.message)
    }
}

const DeleteItem = async (req, res) => 
{
    try
    {
        const cart = await GetCart(req,res);
        const {targetId} = req.body;
        const target = await CartItem.findById(targetId);

        const targetExist = target !== undefined && cart.items.find(i => i._id.toString() === targetId.toString()) !== undefined;

        if(targetExist)
        {
            cart.items.pull(targetId);
            await CartItem.deleteOne(target);
            
            cart.total = await getCartTotal(cart);
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

            cart.total = await getCartTotal(cart);
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

async function getCartTotal(cart)
{
    let total = 0.00;

    for(let i in cart.items)
    {
        const target = await CartItem.findById(cart.items[i]._id);
        const menuItem = await MenuItem.findById(target.itemId);

        total += Number.parseFloat((menuItem.price * target.quantity).toFixed(2));
    }

    return total;
}

module.exports = {
    GetCart,
    GetCartItems,
    GetSingleCartItem,
    AddToCart,
    UpdateItem,
    ClearCart,
    DeleteItem
}