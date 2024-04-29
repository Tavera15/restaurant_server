const Category = require("../Models/Category");

const GetCategories = async (req, res) => {
    try
    {
        const allCategories = await Category.find();
        res.status(200).json(allCategories);
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

const CreateCategory = async (req, res) => {
    try
    {
        res.status(200).json(req);
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    GetCategories
}