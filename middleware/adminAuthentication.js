const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const asyncWrapper = require('./async');
const {createCustomError} = require('../errors/custom_error');

const authenticate = asyncWrapper(async (req, res, next) => {
    const hasAuthorization = req.headers.authorization;
    if (!hasAuthorization) {
        return res.status(400).json({msg: 'Authorization not found'})
    }
    const token = hasAuthorization.split(' ')[1]
    const decodedToken =jwt.verify(token, process.env.TOKEN);

    const admin = await Admin.findById(decodedToken.id);
    if (!admin) {
        return next(createCustomError("Admin not found", 404))
    }
    req.admin = decodedToken;
    next();
    if (error instanceof jwt.JsonWebTokenError) {
        return next(createCustomError("Session time out"))
    }
})

module.exports = {authenticate}