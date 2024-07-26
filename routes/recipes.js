const express = require('express');
const { createRecipe } = require('../controllers/recipe');

const recipeRoute = express.Router();

recipeRoute.post('/recipes', (createRecipe));

module.exports = { recipeRoute }