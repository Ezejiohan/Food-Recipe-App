const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error.js');
const { sendEmail } = require('../utilities/nodemailer');

const createAdmin = asyncWrapper(async (req, res, next) => {
    const { fullname, email, password } = req.body;

    // Check if admin already exists
    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
        return next(createCustomError(`"Admin already exists`, 403))
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new admin
    const newAdmin = await Admin.create({
        fullname,
        email,
        password: hashedPassword,
    });

    // Generate verification link
    const verificationLink = `https://food-recipe-7hlg.onrender.com/admins/verifyAdmin/${newAdmin._id}`;
    const message = `Thanks for registering on Food-Recipe App. Please click the link below to verify your account:\n${verificationLink}`;

    // Email options and sending verification email
    const mailOptions = {
        email: newAdmin.email,
        subject: "Welcome to Food_Recipe App",
        message,
    };
    await sendEmail(mailOptions);

    res.status(201).json({ msg: 'Admin created successfully', admin: newAdmin });
});


const adminLogin = asyncWrapper(async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password }
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        return next(createCustomError("User not found", 404));
    } else {
        const correctPassword = await bcrypt.compare(loginRequest.password, admin.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else {
            const generatedToken = jwt.sign({
                id: admin._id,
                email: admin.email,
            }, process.env.TOKEN, { expiresIn: '12h' })
            const result = {
                id: admin._id,
                email: admin.email,
                token: generatedToken
            }
            return res.status(200).json({ result });
        }
    }
});

const verifyAdmin = asyncWrapper(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404))
    }
    if (admin.verified === true) {
        return next(createCustomError(`Admin already verified`, 400))
    }
    admin.verified = true;
    await admin.save();
    res.status(200).json({
        msg: 'Admin verified Successful',
        data: admin
    });
});

const getAllAdmins = asyncWrapper(async (req, res) => {
    const admin = await Admin.find({})
    res.status(200).json({ admin });
});

const getAdmin = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    const admin = await Admin.findOne(id);
    if (!admin) {
        return next(createCustomError("Admin not found", 404));
    }
    res.status(200).json({ admin });
});


const changePassword = asyncWrapper(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ email: req.admin.email });

    const comparePassword = await bcrypt.compare(oldPassword, admin.password);
    if (comparePassword !== true) {
        return next(createCustomError(`Password incorrect`, 404))
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    if (newPassword === oldPassword) {
        return next(createCustomError(`Unauthorised`, 404))
    }
    admin.password = hashPassword;

    sendEmail({
        email: admin.email,
        subject: "Password change alert",
        message: "You have changed your password. If not you alert us"
    });
    const result = {
        fullname: admin.fullname,
        email: admin.email
    }
    await admin.save();

    return res.status(200).json({
        message: "Password changed successful",
        data: result
    });
});

const updateAdmin = asyncWrapper(async (req, res) => {
    const { id: adminID } = req.params;
    const admin = await Admin.findOneAndUpdate({ _id: adminID }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!admin) {
        return next(createCustomError(`Admin not found : ${adminID}`, 404))
    }
    res.status(200).json({admin});
});

const forgotPassword = asyncWrapper(async (req, res, next) => {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404));
    }
    const token = jwt.sign({
        id: admin._id,
        email: admin.email
    }, process.env.TOKEN)

    const passwordChangeLink = `${req.protocol}://${req.get("host")}/admins/change_password/${admin._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    sendEmail({
        email: admin.email,
        subject: 'Forget password link',
        message: message
    });

    res.status(200).json({
        message: "Email has sent"
    });
})

const resetPassword = asyncWrapper(async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404));
    }

    if (newPassword !== confirmPassword) {
        return next(createCustomError(`There is a difference in both password`, 403))
    }

    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    const updatePassword = await Admin.findByIdAndUpdate(req.params.id, {
        password: hashPassword
    });

    await admin.save();

    res.status(200).json({
        message: 'Password updated successfully',
        data: updatePassword
    });
});

module.exports = {
    createAdmin,
    adminLogin,
    verifyAdmin,
    getAllAdmins,
    getAdmin,
    changePassword,
    updateAdmin,
    forgotPassword,
    resetPassword
}