const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const { SendEmail } = require('../utilities/nodemailer');

const createAdmin = asyncWrapper(async (req, res) => {
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const { fullname, email, password } = req.body;
    const adminExist = await Admin.findOne({
        email: req.body.email
    });

    if (adminExist) {
        return res.status(403).json({
            message: "Admin already Exist"
        })
    } else { 
        const admin = await Admin.create({
            fullname,
            email,
            password: hashPassword,
        })
        res.status(201).json({admin})
    }
    const verificationLink = req.protocol + '://' + req.get("host") + '/api/admins/' + newAdmin._id;
    const message = `Thanks for registring on our Food-Recipe. kindly click this link ${verificationLink} to verify your account`;

    SendEmail({
        email: newAdmin.email,
        subject: "verify your account",
        message
    })
    res.status(200).json({ msg: 'Admin created Successful' });
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
        return res.status(400).json({
            message: "Admin already verified"
        });
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
    const { id: adminID } = req.params;
    const admin = await Admin.findOne({ _id: userID });
    if (!admin) {
        return next(createCustomError("Admin not found", 404));
    }
    res.status(200).json({ admin });
});


const changePassword = asyncWrapper(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;
    const admin = await Amin.findOne({ email: req.admin.email });

    const comparePassword = await bcrypt.compare(oldPassword, admin.password);
    if (comparePassword !== true) {
        return next(createCustomError(`Password incorrect`, 404))
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    if (newPassword === oldPassword) {
        return next(createCustomError(`Unauthorised`, 404))
    }
    user.password = hashPassword;

    SendEmail({
        email: admin.email,
        subject: "Password change alert",
        message: "You have changed your password. If not you alert us"
    });
    const result = {
        fullname: admin.fullname,
        email: user.email
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

    const passwordChangeLink = `${req.protocol}://${req.get("host")}/api/admins/change_password/${admin._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    SendEmail({
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
        return res.status(403).json({
            message: 'There is a difference in both password'
        });
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