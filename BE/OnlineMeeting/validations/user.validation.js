const Joi = require('joi')

const getUserRooms = {
    params: Joi.object().keys({
        userId: Joi.string()
    })
}

const changePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.string().min(6),
        newPassword: Joi.string().min(6),
    }),
}

const searchUsers = {
    query: Joi.object().keys({
        excludeUserId: Joi.string(),
        email: Joi.string(),
        limit: Joi.number(),
        offset: Joi.number(),
        isVerified: Joi.boolean()
    }),
}

module.exports = {
    getUserRooms, changePassword, searchUsers
}