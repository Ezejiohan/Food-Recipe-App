const Recipe = require('../models/recipe');
const User = require('../models/user');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createRecipe = asyncWrapper(async(req, res) => {
    const { recipeName, user, category, ingredient, steps, estimatedCookingTime, serving} = req.body;
    const recipe = await Recipe.create({recipeName, user, category, ingredient, steps, estimatedCookingTime, serving})
    await recipe.save();
    res.status(201).json({recipe})
});

module.exports = { 
    createRecipe
}