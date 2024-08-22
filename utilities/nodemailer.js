const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD
        }
    });

    let mailOptions = {
        from: {
            name: "Food-Recipe App",
            address: process.env.APP_EMAIL
        },
        to: options.email,
        subject: options.subject,
        message: options.message
    }
    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail }