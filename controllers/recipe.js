const Recipe = require('../models/recipe');
const Admin = require('../models/admin');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error.js');

const createRecipe = asyncWrapper(async(req, res) => {
    const { recipeName, admin, category, ingredient, steps, estimatedCookingTime, serving} = req.body; 
    const {adminId} = req.params;
    const admins = await Admin.findById(adminId);
    if (!admins) {
        return next(createCustomError(`Admin not found : ${adminId}`, 404))
    }
    const recipe = await Recipe.create({recipeName, admin, category, ingredient, steps, estimatedCookingTime, serving})
    await recipe.save();
    res.status(201).json({recipe})
});

const getAllRecipes = asyncWrapper(async (req, res) => {
    const recipes = await Recipe.find({}).populate('category')
    res.status(200).json({ recipes })
});

const getOneRecipe = asyncWrapper(async(req, res, next) => {
    const {id} = req.params;
    const recipe = await Recipe.findById(id).populate('category')
    if (!recipe) {
        return next(createCustomError(`Recipe not found : ${id}`, 404))
    }
    res.status(200).json({recipe});
});

const updateRecipe = asyncWrapper(async(req, res, next) => {
    const {id:recipeId} = req.params;
    const recipe = await Recipe.findOneAndUpdate({_id:recipeId}, req.body, {
        new: true,
        runValidators: true
    }).populate('category');
    if (!recipe) {
        return next(createCustomError(`Recipe not found : ${recipeId}`, 404))
    }
    res.status(200).json({recipe})
});

module.exports = { 
    createRecipe,
    getAllRecipes,
    getOneRecipe,
    updateRecipe
}