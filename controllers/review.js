const Review = require('../models/review');
const Recipe = require('../models/recipe');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');

const createReview = asyncWrapper(async (req, res, next) => {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        return next(createCustomError(`Recipe not found: ${recipeId}`, 404));
    }

    const review = await Review.create({
        user: req.user._id,
        recipe: recipeId,
        rating,
        comment
    });

    await review.save();
    
    recipe.reviews.push(review._id);
    await recipe.save();

    res.status(201).json({ review });
});

module.exports = { createReview };
