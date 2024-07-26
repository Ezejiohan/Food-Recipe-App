const express = require('express');
const { createIngredient, 
    getAllIngredients, 
    getOneIngredient,
    updateIngredient 
} = require('../controllers/ingredient');

const ingredientRoute = express.Router();

ingredientRoute.post('/ingredients', (createIngredient));
ingredientRoute.get('/ingredients', (getAllIngredients));
ingredientRoute.get('/ingredients/:id', (getOneIngredient));
ingredientRoute.put('/ingredients/:id', (updateIngredient));


module.exports = { ingredientRoute }