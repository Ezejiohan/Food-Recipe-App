const express = require('express');
const { createReview, getAllReviews } = require('../controllers/review');

const reviewRoute = express.Router();

reviewRoute.post('/reviews/:recipeId', (createReview));
reviewRoute.get('/reviews', (getAllReviews));

module.exports = {reviewRoute};