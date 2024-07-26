const express = require('express');
const { createRecipe, getAllRecipes } = require('../controllers/recipe');

const recipeRoute = express.Router();

recipeRoute.post('/recipes', (createRecipe));
recipeRoute.get('/recipes', (getAllRecipes));

module.exports = { recipeRoute }