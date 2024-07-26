const Category = require('../models/category');
const asyncWrapper = require('../middleware/async');

const createCategory = asyncWrapper(async (req, res) => {
    const { category_name } = req.body;
    if (!category_name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await Category.create({ category_name });

    await category.save();
    res.status(201).json({ category });
});

module.exports = { createCategory };