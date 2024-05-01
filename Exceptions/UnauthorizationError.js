class UnauthorizationError extends Error
{
    constructor()
    {
        super();
        this.message = "User is not authorized";
        this.status = 401;
    }
}

module.exports = UnauthorizationError;