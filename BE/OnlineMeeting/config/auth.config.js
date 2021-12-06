require('dotenv').config()

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    googleId: process.env.GOOGLE_ID,
    googleSecret: process.env.GOOGLE_SECRET,
    facebookId: process.env.FACEBOOK_ID,
    facebookSecret: process.env.FACEBOOK_SECRET,
    siteUrl: process.env.NODE_ENV.trim() === 'development' ? "http://localhost:3000/" : process.env.SITE_URL
}