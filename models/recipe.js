const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
    recipename: {
        type: String,
        required: true
    },
    ingredient: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient',
            required: true
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    steps: [{
        type: String,
        required: true
    }],
    estimatedcookingtime: {
        type: Number,
        required: true
    },
    serving: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;