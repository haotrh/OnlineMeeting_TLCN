const Joi = require('joi');

const create = {
    body: Joi.object().keys({
        userId: Joi.string(),
        name: Joi.string().required().min(2),
        isPrivate: Joi.boolean().required(),
        allowChat: Joi.boolean().required(),
        allowMicrophone: Joi.boolean().required(),
        allowCamera: Joi.boolean().required(),
        allowScreenShare: Joi.boolean().required(),
        allowRaiseHand: Joi.boolean().required(),
        allowQuestion: Joi.boolean().required(),
        guests: Joi.array()
    })
}

const update = {
    body: Joi.object().keys({
        name: Joi.string().required().min(2),
        isPrivate: Joi.boolean().required(),
        allowChat: Joi.boolean().required(),
        allowMicrophone: Joi.boolean().required(),
        allowCamera: Joi.boolean().required(),
        allowScreenShare: Joi.boolean().required(),
        allowRaiseHand: Joi.boolean().required(),
        allowQuestion: Joi.boolean().required(),
        guests: Joi.array()
    })
}

module.exports = {
    create, update
}