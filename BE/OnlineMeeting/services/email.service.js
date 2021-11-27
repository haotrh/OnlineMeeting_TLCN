const nodemailer = require('nodemailer');
const authConfig = require('../config/auth.config');
const urljoin = require('url-join')

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'omeeting.website@gmail.com', //server mail
        pass: 'Omeeting!23' //server mail password
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendEmail = async (to, subject, text) => {
    var content = '';
    content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <span style="color: black">${text}</span>
            </div>
        </div>
    `;
    var mainOptions = {
        from: 'Online Meeting Verification',
        to,
        subject,
        text,
        html: content
    }
    await transport.sendMail(mainOptions)
}

const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    const text = `Dear user,
    Your reset password link is: ${urljoin(authConfig.siteUrl, "reset-password", `?token=${token}`)}
    If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    const text = `Dear user,
    Your verification link is: ${urljoin(authConfig.siteUrl, "verify-email", `?token=${token}`)}
    If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, text);
};

module.exports = {
    transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail
}