const Order = require("../Models/Order");
const User = require("../Models/User");
const MenuItem = require("../Models/MenuItem");

const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");

const PlaceOrder = async (req, res) =>
{
    try
    {
        // const user = await User.findById(req.userId);
        const {customer_delivery, cart} = req.body;
        let grand_total = 0.00;

         await Promise.all(cart.map(async (item, i) => {
            const menuItem = await MenuItem.findById(item.menuItemId);
            
            if(!menuItem) {throw new EntityNotFoundError(`${item.name} was not found`)}
            grand_total += (menuItem.price * item.quantity);
        }));

        const newOrder = new Order({customer_delivery, cart, grand_total, status: "placed"});

        res.status(200).json(newOrder);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

module.exports = {
    PlaceOrder
}