const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');


const createUser = asyncWrapper( async (req, res) => {
    const {fullname, email, password } = req.body;
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const user = await User.create({
        fullname,
        email,
        password: hashPassword,
    })
    res.status(201).json({ user });
})

const userLogin = asyncWrapper( async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password}
    const user = await User.findOne({ email: req.body.email});
    if (!user) {
        return next(createCustomError("User not found", 404));
    } else {
        const correctPassword = await bcrypt.compare(loginRequest.password, user.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else {
            const generatedToken = jwt.sign({
                id: user._id,
                email: user.email,
            }, process.env.TOKEN, { expiresIn: '12h'})
            const result = {
                id: user._id,
                email: user.email,
                token: generatedToken
            }
            return res.status(200).json({result});
        }
    }
});

const verifyUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) { 
        return next(createCustomError(`User not found`, 404))
    }
    if (user.verified === true) {
        return res.status(400).json({
                message: "User already verified"
        });
    }
    user.verified = true;
    await user.save();
    res.status(200).json({
        msg: 'User verified Successful',
        data: user
    });
});
const getAllUsers = asyncWrapper(async (req, res) => {
    const user = await User.find({})
    res.status(200).json({user});
});

const getUser = asyncWrapper(async(req, res, next) => {
    const {id:userID} = req.params;
    const user = await User.findOne({ _id:userID});
    if (!user) {
        return next(createCustomError("User not found", 404));   
    }
    res.status(200).json({user});
});


const changePassword = asyncWrapper(async (req, res, next) => {

        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email: req.user.email });
       
        const comparePassword = await bcrypt.compare(oldPassword, user.password);
        if (comparePassword !== true) {
         return next(createCustomError(`Password incorrect`, 404))
        }
        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);
 
        if (newPassword === oldPassword) {
         return next(createCustomError(`Unauthorised`, 404))
        }
        user.password = hashPassword;
 
        sendEmail({
         email: user.email,
         subject: "Password change alert",
         message: "You have changed your password. If not you alert us"
        });
        const result = {
         fullname: user.fullname,
         username: user.username,
         email: user.email
        }
        await user.save();
 
        return res.status(200).json({
         message: "Password changed successful",
         data: result
        });
});

const updateUser = asyncWrapper(async (req, res) => {
    const { id:userID } = req.params;
    const user = await User.findOneAndUpdate({ _id:userID }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(createCustomError(`User not found : ${userID}`, 404)) 
    }
    res.status(200).json({user});
});

const forgotPassword = asyncWrapper(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createCustomError(`User not found`, 404));
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.TOKEN)

        const passwordChangeLink = `${req.protocol}://${req.get("host")}/api/user/change_password/${user._id}/${token}`;
        const message = `Click this link: ${passwordChangeLink} to set a new password`;

        sendEmail({
            email: user.email,
            subject: 'Forget password link',
            message: message
        });

        res.status(200).json({
            message: "Email has sent"
        });
})

const resetPassword = asyncWrapper(async (req, res, next) => {
        const { newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(createCustomError(`User not found`, 404));
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(403).json({
                message: 'There is a difference in both password'
            });
        }
        
        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

        const updatePassword = await User.findByIdAndUpdate(req.params.id, {
            password: hashPassword
        });

        await user.save();

        res.status(200).json({
            message: 'Password updated successfully',
            data: updatePassword
        });
});

module.exports = { 
    createUser, 
    userLogin,
    verifyUser,
    getAllUsers,
    getUser,
    changePassword,
    updateUser,
    forgotPassword,
    resetPassword
}