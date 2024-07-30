const express = require('express');
const { createRecipe, getAllRecipes, getOneRecipe, updateRecipe } = require('../controllers/recipe');

const recipeRoute = express.Router();

recipeRoute.post('/recipes', (createRecipe));
recipeRoute.get('/recipes', (getAllRecipes));
recipeRoute.get('/recipes/:id', (getOneRecipe));
recipeRoute.put('/recipes/:id', (updateRecipe));

module.exports = { recipeRoute }