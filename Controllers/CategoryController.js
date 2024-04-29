const Category = require("../Models/Category");
const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");

const GetCategory = async (name) =>
{
    const target = await Category.findOne({name});
    
    if(target === null) {
        throw new EntityNotFoundError(`${name} was not found`);
    }
    
    return target;
}

const GetCategories = async (req, res) => 
{
    try
    {
        const name = req.params.name;
        const result = (name === undefined)
            ? await Category.find()
            : await GetCategory(name);

        res.status(200).json(result);
    }
    catch(err)
    {
        if(err instanceof EntityNotFoundError)
        {
            res.status(404).json(err);
        }
        else
        {
            res.status(500).json("Something went wrong");
        }
    }
}

const CreateCategory = async (req, res) => 
{
    try
    {
        const {name} = req.body;
        const newCategory = new Category({name});
        
        await newCategory.save();
        res.status(201).json(newCategory);
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

const UpdateCategory = async (req, res) =>
{
    try
    {
        const name = req.params.name;
        const target = await GetCategory(name);
        const newData = req.body;

        target.name = newData.name;
        
        await target.save();
        res.status(200).json(target);
    }
    catch(err)
    {
        if(err instanceof EntityNotFoundError)
        {
            res.status(404).json(err);
        }
        else
        {
            res.status(500).json({message: "Something went wrong"});
        }
    }
}

const DeleteCategory = async (req, res) => 
{
    try
    {
        const name = req.params.name;
        const target = await GetCategory(name);
        await Category.findByIdAndDelete(target._id);

        return res.status(200).json({message: `Successfully deleted category: ${name}`});
    }
    catch(err)
    {
        if(err instanceof EntityNotFoundError)
        {
            res.status(404).json(err);
        }
        else
        {
            res.status(500).json({message: "Something went wrong"});
        }
    }
}

module.exports = {
    GetCategories,
    CreateCategory,
    UpdateCategory,
    DeleteCategory
}