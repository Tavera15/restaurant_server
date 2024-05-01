const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const Category = require("../Models/Category");
const MenuItem = require("../Models/MenuItem");

const GetMenuItem = async (name) => 
{
    const target = await MenuItem.findOne({name});

    if(!target) {throw new EntityNotFoundError(`${name} not found`)}

    return target;
}

const GetCategory = async (categoryId) => 
{
    const target = await Category.findById(categoryId);

    if(!target) {throw new EntityNotFoundError("Category listed not found")}

    return target;
}

const GetMenuItems = async (req, res) => 
{
    try
    {
        const name = req.params.name;
        const result = (name === undefined)
            ? await MenuItem.find()
            : await GetMenuItem(name);

        res.status(200).json(result);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const CreateMenuItem = async (req, res) =>
{
    try
    {
        const {name, description, price, categoryId} = req.body;
        
        const category = await Category.findById(categoryId);
        if(!category) {throw new EntityNotFoundError("Category listed not found")}

        const newMenuItem = new MenuItem({name, description, price, category});
        await newMenuItem.save();

        res.status(200).json(req.body);
    }
    catch(err)
    {
        switch(err)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json(err.message);
        }
    }
}

const UpdateMenuItem = async (req, res) =>
{
    try
    {
        const name = req.params.name;
        const newData = req.body;
        
        const target            = await GetMenuItem(name);
        const newCategory       = await GetCategory(newData.categoryId);

        target.name             = newData.name;
        target.description      = newData.description;
        target.price            = newData.price;
        target.category         = newCategory;

        await target.save();
        res.status(201).json(target);
    }
    catch(err)
    {
        switch(err)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

const DeleteMenuItem = async (req, res) => 
{
    try
    {
        const name = req.params.name;
        const target = await GetMenuItem(name);
        await MenuItem.findByIdAndDelete(target._id);

        return res.status(200).json({message: `Successfully deleted menu item: ${name}`});
    }
    catch(err)
    {
        switch(err)
        {
            case err instanceof EntityNotFoundError:
                res.status(404).json(err);
                break;
            default:
                res.status(500).json({message: err.message});
                break;
        }
    }
}

module.exports = {
    GetMenuItems,
    CreateMenuItem,
    UpdateMenuItem,
    DeleteMenuItem
}