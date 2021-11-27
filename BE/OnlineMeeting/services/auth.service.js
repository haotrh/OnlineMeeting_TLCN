const userService = require('./user.service')
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const tokenService = require('./token.service');
const { tokenTypes } = require('../config/token.config');
const { cleanModelAttributes } = require('../utils/cleanModelAttributes');
const db = require('../models');

const loginWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email, true);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password")
    }

    cleanModelAttributes(user, db.user.secretColumns)
    return user;
}

const loginWithGoogle = async (idToken) => {
    const payload = await tokenService.verifyGoogleIdToken(idToken)
    //Get user
    const user = await userService.getUserByEmail(payload.email, true)
    //Create if not exist
    if (!user) {
        const newUser = await userService.createUser({
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            displayName: payload.name,
            profilePic: payload.picture,
            isVerified: true,
            provider: 'google'
        })

        cleanModelAttributes(newUser, db.user.secretColumns)
        return newUser
    }
    if (user.provider !== 'google') {
        throw new ApiError(httpStatus.BAD_REQUEST, "User with the email address already exists")
    }

    cleanModelAttributes(user, db.user.secretColumns)

    return user;
}

const loginWithFacebook = async (accessToken) => {
    const payload = await tokenService.verifyFacebookAccessToken(accessToken)
    //Get user
    const user = await userService.getUserByEmail(payload.email, true)
    //Create if not exist
    if (!user) {
        const newUser = await userService.createUser({
            email: payload.email,
            firstName: payload.first_name,
            lastName: payload.last_name,
            displayName: payload.name,
            profilePic: `https://graph.facebook.com/v12.0/${payload.id}/picture?type=large`,
            isVerified: true,
            provider: 'facebook'
        })

        cleanModelAttributes(newUser, db.user.secretColumns)
        return newUser
    }
    if (user.provider !== 'facebook') {
        throw new ApiError(httpStatus.BAD_REQUEST, "User with the email address already exists")
    }

    cleanModelAttributes(user, db.user.secretColumns)

    return user;
}

const refreshAuth = async (refreshToken) => {
    try {
        console.log(refreshToken)
        const payload = await tokenService.verifyJwtToken(refreshToken);
        if (payload.type !== tokenTypes.REFRESH) {
            throw new Error();
        }
        const user = await userService.getUserById(payload.sub);
        if (!user) {
            throw new Error();
        }
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unanthenticated");
    }
}

const verifyEmail = async (verifyEmailToken) => {
    try {
        const payload = await tokenService.verifyJwtToken(verifyEmailToken);
        if (payload.type !== tokenTypes.VERIFY_EMAIL) {
            throw new Error();
        }
        const user = await userService.getUserById(payload.sub);
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(payload.sub, { isVerified: true });
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
}

const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const payload = await tokenService.verifyJwtToken(resetPasswordToken);
        if (payload.type !== tokenTypes.RESET_PASSWORD) {
            throw new Error();
        }
        const user = await userService.getUserById(payload.sub);
        console.log(user)
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(user.id, { password: newPassword });
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

module.exports = {
    loginWithEmailAndPassword, refreshAuth, verifyEmail, resetPassword, loginWithGoogle, loginWithFacebook
}