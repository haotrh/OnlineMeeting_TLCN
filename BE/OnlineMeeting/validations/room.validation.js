const Joi = require('joi');

const create = {
    body: Joi.object().keys({
        name: Joi.string().required().min(2)
    })
}

module.exports = {
    create
}