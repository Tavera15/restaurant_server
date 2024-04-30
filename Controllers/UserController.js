const User = require("../Models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const PasswordNotMatchError = require("../Exceptions/PasswordNotMatchError");

const CreateUser = async (req, res) =>
{
    try
    {
        const {auth0Id = "sds", name, email, password} = req.body;
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({auth0Id, name, email, password: hash});
        
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const UpdateUser = async (req, res) => 
{
    try
    {
        const targetId = req.body.userId;
        const target = await User.findById(targetId);

        if(target === null) {throw new EntityNotFoundError("User not found")}

        const newData = req.body;
        
        target.name = newData.name;
        target.email = newData.email;

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
            res.status(500).json({message: err.message});
        }
    }
}

const UpdatePassword = async (req, res) =>
{
    try
    {
        const {userId, oldPassword, newPassword} = req.body;
        const target = await User.findById(userId);
        const isPasswordMatch =  await bcrypt.compare(oldPassword, target.password);

        if(!isPasswordMatch) {throw new PasswordNotMatchError()}

        const newHash = await bcrypt.hash(newPassword, saltRounds);
        target.password = newHash;
        await target.save();

        res.status(200).json(target);
    }
    catch(err)
    {
        if(err instanceof PasswordNotMatchError)
        {
            res.status(401).json(err);
        }
        else
        {
            res.status(500).json(err.message);
        }
    }
}

module.exports = {
    CreateUser,
    UpdateUser,
    UpdatePassword,
}