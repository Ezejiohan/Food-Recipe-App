const express = require('express');
const { createCategory, 
    getAllCategorys 
} = require('../controllers/category');
const { authenticate } = require('../middleware/adminAuthentication');

const categoryRouter = express.Router();

// Route to create a new category
categoryRouter.post('/categorys', authenticate, (createCategory));
categoryRouter.get('/categorys/getAllCategorys', authenticate, (getAllCategorys))

module.exports = categoryRouter;
