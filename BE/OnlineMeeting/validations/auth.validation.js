const Joi = require('joi');

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6),
        firstName: Joi.string().required().min(2),
        lastName: Joi.string().required().min(2)
    })
}

const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
}

const loginWithGoogle = {
    body: Joi.object().keys({
        idToken: Joi.string().required()
    })
}

const loginWithFacebook = {
    body: Joi.object().keys({
        accessToken: Joi.string().required()
    })
}

const refreshToken = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    })
}

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
}

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().min(6),
    }),
};

const verifyEmail = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
}

module.exports = {
    register, login, refreshToken, verifyEmail, forgotPassword, resetPassword, loginWithGoogle, loginWithFacebook
}