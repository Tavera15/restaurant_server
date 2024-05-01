const jwt = require("jsonwebtoken");
const UnauthorizationError = require("../Exceptions/UnauthorizationError");

const verifyToken = (req, res, next) => 
{
    try
    {
        const token = req.header(process.env.JWT_HEADER);
        if(!token) {throw new UnauthorizationError()}

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded) {throw new UnauthorizationError()}

        req.userId = decoded.userId;
        next();
    }
    catch(err)
    {
        if(err instanceof UnauthorizationError)
        {
            res.status(401).json(err);
        }
        else
        {
            res.status(500).json({message: "Something went wrong"});
        }
    }
}

module.exports = verifyToken;