const Ingredient = require('../models/ingredient');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createIngredient = asyncWrapper(async (req, res) => {
    const { name, quantity } = req.body;
    const ingredient = await Ingredient.create({ name, quantity });
    await ingredient.save();
    res.status(201).json({ ingredient })
});

const getAllIngredients = asyncWrapper(async (req, res) => {
    const ingredients = await Ingredient.find({});
    res.status(201).json({ ingredients })
});

const getOneIngredient = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    const ingredient = await Ingredient.findById(id)
    if (!ingredient) {
        return next(createCustomError(`Ingredient not found : ${id}`, 404))
    }
    res.status(200).json({ ingredient })
});

const updateIngredient = asyncWrapper(async(req, res, next) => {
    const {id:ingredientId} = req.params;
    const ingredient = await Ingredient.findOneAndUpdate({_id:ingredientId}, req.body, {
        new: true,
        runValidators: true
    });
    if (!ingredient) {
        return next(createCustomError(`Ingredient not found : ${ingredientId}`, 404))
    }
res.status(200).json({ingredient})
})

module.exports = {
    createIngredient,
    getAllIngredients,
    getOneIngredient,
    updateIngredient
}