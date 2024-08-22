const express = require('express');
const { createIngredient, 
    getAllIngredients, 
    getOneIngredient,
    updateIngredient 
} = require('../controllers/ingredient');
const { authenticate } = require('../middleware/adminAuthentication');

const ingredientRoute = express.Router();

ingredientRoute.post('/ingredients', authenticate, (createIngredient));
ingredientRoute.get('/ingredients', authenticate, (getAllIngredients));
ingredientRoute.get('/ingredients/:id', authenticate, (getOneIngredient));
ingredientRoute.put('/ingredients/:id', authenticate, (updateIngredient));


module.exports = { ingredientRoute }