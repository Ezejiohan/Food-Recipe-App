const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ezejiohan@gmail.com",
            pass: "otkiovtlexmumkqy"
        }
    });

    let mailOptions = {
        from: {
            name: "Food-Recipe App",
            address: "ezejiohan@gmail.com"
        },
        to: options.email,
        subject: options.subject,
        message: options.message
    }
    await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail }