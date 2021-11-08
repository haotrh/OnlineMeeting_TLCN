const db = require('../models')
const User = db.user;
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status');

const createUser = async (body) => {
    const user = await getUserByEmail(body.email)
    if (user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
    }
    return User.create(body)
}

const queryUsers = async (filter, options) => {
    const users = await User.findAll();
    return users;
}

const getUserByEmail = async (email, withSecret = false) => {
    if (withSecret) return User.scope('withSecretColumns').findOne({ where: { email } })
    return User.findOne({ where: { email } })
}

const getUserById = async (id, withSecret = false) => {
    if (withSecret) return User.scope('withSecretColumns').findOne({ where: { id } })
    return User.findOne({ where: { id } })
}

const updateUserById = async (userId, body) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.update(body)
}

const deleteUserById = async (userId) => {
    return User.destroy({ where: { id: userId } })
}

module.exports = {
    createUser, getUserByEmail, getUserById, updateUserById, deleteUserById, queryUsers
}