const express = require('express');
const { createReview, getAllReviews } = require('../controllers/review');
const { userAuthenticate } = require('../middleware/userAuthentication');

const reviewRoute = express.Router();

reviewRoute.post('/reviews/:recipeId', userAuthenticate, (createReview));
reviewRoute.get('/reviews', userAuthenticate, (getAllReviews));

module.exports = {reviewRoute};