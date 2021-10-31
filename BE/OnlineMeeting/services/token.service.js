const { default: axios } = require('axios');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/auth.config');
const { tokenTypes } = require('../config/token.config');
const ApiError = require('../utils/ApiError');

const generateJwtToken = (email, sub, expires, type) => {
    const payload = {
        email, sub, type,
        iat: moment().unix(),
        exp: expires.unix()
    }
    return jwt.sign(payload, config.jwtSecret)
}

const verifyJwtToken = async (token) => {
    const payload = jwt.verify(token, config.jwtSecret)
    return payload
}

const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.accessExpirationMinutes, 'minutes');
    const accessToken = generateJwtToken(user.email, user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.refreshExpirationDays, 'days');
    const refreshToken = generateJwtToken(user.email, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

const generateResetPasswordToken = async (user) => {
    const expires = moment().add(config.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateJwtToken(user.email, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
}

const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(config.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateJwtToken(user.email, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
}

const verifyGoogleIdToken = async (idToken) => {
    //Creat google client
    const { OAuth2Client } = require('google-auth-library')
    const client = new OAuth2Client(config.googleId);
    //verify
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: config.googleId
        });
        const payload = ticket.getPayload();
        return payload
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Google authentication failed")
    }
}

const verifyFacebookAccessToken = async (accessToken) => {
    const requestUrl = `https://graph.facebook.com/v12.0/me?fields=first_name%2Clast_name%2Cemail%2Cname%2Cpicture%7Burl%7D&access_token=${accessToken}`
    try {
        const data = (await axios.get(requestUrl)).data
        if (data.error) throw new Error()
        return data
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Facebook authentication failed")
    }
}

module.exports = {
    generateJwtToken,
    verifyJwtToken,
    generateVerifyEmailToken,
    generateAuthTokens,
    generateResetPasswordToken,
    verifyFacebookAccessToken,
    verifyGoogleIdToken
}