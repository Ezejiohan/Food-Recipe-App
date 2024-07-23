const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'fullname must be provided'],
        trim: true,
        maxlength: [20, 'fullname must not have more than 20 characters']
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password must be 9characters long and include at least one uppercase and one special character']
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;