const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncWrapper = require('./async');
const {createCustomError} = require('../errors/custom_error');

const userAuthenticate = asyncWrapper(async (req, res, next) => {
    const hasAuthorization = req.headers.authorization;
    if (!hasAuthorization) {
        return res.status(400).json({msg: 'Authorization not found'})
    }
    const token = hasAuthorization.split(' ')[1]
    const decodedToken =jwt.verify(token, process.env.TOKEN);

    const user = await User.findById(decodedToken.id);
    if (!user) {
        return next(createCustomError("User not found", 404))
    }
    req.user = decodedToken;
    next();
    if (error instanceof jwt.JsonWebTokenError) {
        return next(createCustomError("Session time out"))
    }
})

module.exports = {userAuthenticate}