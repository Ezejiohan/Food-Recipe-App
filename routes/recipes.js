const express = require('express');
const { createRecipe, getAllRecipes, getOneRecipe, updateRecipe } = require('../controllers/recipe');
const { authenticate } = require('../middleware/adminAuthentication');

const recipeRoute = express.Router();

recipeRoute.post('/recipes', authenticate, (createRecipe));
recipeRoute.get('/recipes', authenticate, (getAllRecipes));
recipeRoute.get('/recipes/:id', authenticate, (getOneRecipe));
recipeRoute.put('/recipes/:id', authenticate, (updateRecipe));

module.exports = { recipeRoute }