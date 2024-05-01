const User = require("../Models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const EntityNotFoundError = require("../Exceptions/EntityNotFoundError");
const PasswordNotMatchError = require("../Exceptions/PasswordNotMatchError");
const UnauthorizationError = require("../Exceptions/UnauthorizationError");


const UserRegistration = async (req, res) =>
{
    try
    {
        const {auth0Id = "sds", name, email, password} = req.body;
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({auth0Id, name, email, password: hash});

        await newUser.save();
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1hr"});
        
        res.status(201).json(token);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const UserLogin = async (req, res) => 
{
    try
    {
        const {email, passwordInput} = req.body;

        const target = await User.findOne({email});        
        if(!target) {throw new UnauthorizationError()}

        const isPasswordMatch = await bcrypt.compare(passwordInput, target.password);
        if(!isPasswordMatch) {throw new UnauthorizationError()}

        const token = jwt.sign({userId: target._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1hr"});
        res.status(200).json(token);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
}

const GetUser = async (req, res) =>
{
    try
    {
        const target = await User.findById(req.userId).select("-password");
        res.status(200).json(target);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}

const UpdateUser = async (req, res) => 
{
    try
    {
        const targetId = req.body.userId;
        const target = await User.findById(targetId);

        if(!target) {throw new EntityNotFoundError("User not found")}

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
    GetUser,
    UserRegistration,
    UserLogin,
    UpdateUser,
    UpdatePassword,
}