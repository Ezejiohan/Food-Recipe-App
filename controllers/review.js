const Review = require('../models/review');
const Recipe = require('../models/recipe');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error'); // Custom error handling

// Create a review controller
const createReview = asyncWrapper(async (req, res, next) => {
    const { recipeId } = req.params;
    const { userId } = req.body; 
    const { rating, comment } = req.body; 
    
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        return next(createCustomError('Recipe not found', 404));
    }

    const existingReview = await Review.findOne({ recipe: recipeId, user: userId });
    if (existingReview) {
        return res.status(400).json({ message: 'User has already reviewed this recipe' });
    }
    const review = await Review.create({
        recipe: recipeId,
        user: userId,
        rating,
        comment
    });

    res.status(201).json({
        message: 'Review created successfully',
        review
    });
});

module.exports = { createReview };


const getAllReviews = asyncWrapper(async (req, res) => {
    const review = await Review.find({})
    res.status(200).json({review})
});

const getOneReview = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
        return next(createCustomError(`Review not found with ID: ${id}`, 404));
    }
    res.status(200).json({ review });
});

module.exports = { createReview, getAllReviews, getOneReview };
