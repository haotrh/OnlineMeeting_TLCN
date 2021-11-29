const db = require('../models')
const User = db.user;
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const createUser = async (body) => {
    const user = await getUserByEmail(body.email)
    if (user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
    }
    return User.create(body)
}

const getUsers = async ({ email, isVerified, limit, offset, excludeUserId }) => {
    let query = {}

    query.where = {}

    if (email) {
        query.where.email = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', '%' + email.toLowerCase() + '%')
    }

    if (isVerified) {
        query.where.isVerified = true
    }

    if (excludeUserId) {
        query.where.id = {
            [Op.not]: excludeUserId
        }
    }

    if (limit) {
        query.limit = limit
    }

    if (offset) {
        query.offset = offset
    }

    const users = await User.findAll(query)

    return users
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
    createUser, getUserByEmail, getUserById, updateUserById, deleteUserById, getUsers
}