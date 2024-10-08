require('dotenv').config();
const express = require('express');
const {route} = require('./routes/users');
const {ingredientRoute} = require('./routes/ingredients');
const {recipeRoute} = require('./routes/recipes');
const {adminRoute} = require('./routes/admins');
const {reviewRoute} = require('./routes/reviews');

const connectDB = require('./database/database');
connectDB();

const app = express();
const {notFound} = require('./middleware/not_found');
const errorHandlerMiddleware = require('./middleware/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', route);
app.use('/', ingredientRoute);
app.use('/', recipeRoute);
app.use('/', adminRoute);
app.use('/', reviewRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 6000;

app.listen(process.env.PORT, () => {
    console.log('app is listening on PORT ' + process.env.PORT)
});
