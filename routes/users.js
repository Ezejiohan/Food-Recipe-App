const express = require('express');

const { createUser, 
    userLogin, 
    verifyUser, 
    changePassword, 
    forgotPassword, 
    getAllUsers, 
    getUser, 
    resetPassword 
} = require('../controllers/user');
const { userAuthenticate } = require('../middleware/userAuthentication');
const route = express.Router();

route.post('/users', (createUser));
route.post('/users/loginUser', (userLogin));
route.get('/users/:id', (verifyUser));
route.get('/users', userAuthenticate, (getAllUsers));
route.get('/users/:id', userAuthenticate, (getUser))
route.put('/users',userAuthenticate, (changePassword));
route.post('/users/forgotPassword', (forgotPassword));
route.patch('/users/change_password/:id/:token', (resetPassword));


module.exports = { route }