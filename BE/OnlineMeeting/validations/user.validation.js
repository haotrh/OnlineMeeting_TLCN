const Joi = require('joi')

const getUserCreatedRooms = {
    params: Joi.object().keys({
        userId: Joi.string()
    })
}

module.exports = {
    getUserCreatedRooms
}