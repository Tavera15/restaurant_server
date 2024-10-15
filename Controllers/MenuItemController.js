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
        const customs = JSON.stringify(req.body.customs);
        
        const category = await Category.findById(categoryId);
        if(!category) {throw new EntityNotFoundError("Category listed not found")}

        const newMenuItem = new MenuItem({name, description, price, category, customs});
        await newMenuItem.save();

        res.status(200).json(newMenuItem);
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
        const id = req.params.id;
        const newData = req.body;
        
        const target            = await MenuItem.findById(id);
        const newCategory       = await GetCategory(newData.categoryId);

        target.name             = newData.name;
        target.description      = newData.description;
        target.price            = newData.price;
        target.category         = newCategory;
        target.customs          = JSON.stringify(newData.customs);

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
        const id = req.params.id;
        await MenuItem.findByIdAndDelete(id);

        return res.status(200);
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