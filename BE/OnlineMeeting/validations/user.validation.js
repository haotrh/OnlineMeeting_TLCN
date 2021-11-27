const Joi = require('joi')

const getUserCreatedRooms = {
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

module.exports = {
    getUserCreatedRooms, changePassword
}