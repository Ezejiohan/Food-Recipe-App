const express = require('express');
const { createReview } = require('../controllers/review');

const reviewRoute = express.Router();

reviewRoute.post('/reviews/:recipeId', (createReview));

module.exports = {reviewRoute};