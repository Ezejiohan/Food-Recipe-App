const express = require('express');

const { createAdmin, 
    adminLogin, 
    verifyAdmin, 
    getAllAdmins, 
    getAdmin,
    changePassword,
    forgotPassword,
    resetPassword 
} = require('../controllers/admin');
const { authenticate } = require('../middleware/adminAuthentication');
const adminRoute = express.Router();

adminRoute.post('/admins', (createAdmin));
adminRoute.post('/admins/loginUser', (adminLogin));
adminRoute.get('/admins/:id', (verifyAdmin));
adminRoute.get('/admins', authenticate, (getAllAdmins));
adminRoute.get('/admins/:id', authenticate, (getAdmin))
adminRoute.put('/admins', authenticate, (changePassword));
adminRoute.post('/admins/forgotPassword', (forgotPassword));
adminRoute.patch('/admins/change_password/:id/:token', (resetPassword));


module.exports = { adminRoute }