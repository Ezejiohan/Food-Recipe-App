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

const getAllRecipes = asyncWrapper(async (req, res) => {
    const recipes = await Recipe.find({}).populate('category, subcategory')
    res.status(200).json({ recipes })
});

const getOneRecipe = asyncWrapper(async(req, res, next) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id).populate('category, subcategory')
    if (!recipe) {
        return next(createCustomError(`Recipe not found : ${id}`, 404))
    }
    res.status(200).json({recipe});
});

module.exports = { 
    createRecipe,
    getAllRecipes,
    getOneRecipe
}