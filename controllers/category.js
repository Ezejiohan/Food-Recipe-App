const Category = require('../models/category');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');

const createCategory = asyncWrapper(async (req, res, next) => {
    const { category_name } = req.body;
    if (!category_name) {
        return next(createCustomError(`Category name is required`, 400));
    }

    const category = await Category.create({ category_name });

    await category.save();
    res.status(201).json({ category });
});

const getAllCategorys = asyncWrapper(async (req, res) => {
    const category = await Category.find({})
    res.status(200).json({category})
})

module.exports = { createCategory,
    getAllCategorys
 };