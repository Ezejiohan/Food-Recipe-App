const express = require('express');

const { createAdmin, 
    adminLogin, 
    verifyAdmin, 
    getAllAdmins, 
    getAdmin 
} = require('../controllers/admin');
const adminRoute = express.Router();

adminRoute.post('/admins', (createAdmin));
adminRoute.post('/admins/loginUser', (adminLogin));
adminRoute.get('/admins/:id', (verifyAdmin));
adminRoute.get('/admins', (getAllAdmins));
adminRoute.get('/admins/:id', (getAdmin))
adminRoute.put('/admins', (changePassword));
adminRoute.post('/admins/forgotPassword', (forgotPassword));
adminRoute.patch('/admins/change_password/:id/:token', (resetPassword));


module.exports = { adminRoute }