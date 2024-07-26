const express = require('express');
const { createIngredient, getAllIngredients, getOneIngredient } = require('../controllers/ingredient');

const ingredientRoute = express.Router();

ingredientRoute.post('/ingredients', (createIngredient));
ingredientRoute.get('/ingredients', (getAllIngredients));
ingredientRoute.get('/ingredients/:id', (getOneIngredient));

module.exports = { ingredientRoute }