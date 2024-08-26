const express = require('express');
const { createCategory } = require('../controllers/categoryController'); // Import the createCategory controller

const categoryRouter = express.Router();

// Route to create a new category
categoryRouter.post('/create', createCategory);

module.exports = categoryRouter;
