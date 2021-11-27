const httpStatus = require('http-status');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');

const getUsers = catchAsync(async (req, res) => {
    const result = await userService.queryUsers(filter, options);
    res.send(result);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

const getUserCreatedRooms = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const rooms = await user.getCreatedRooms();
    res.send(rooms);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.send(user);
});

const changePassword = catchAsync(async (req, res) => {
    let { oldPassword, newPassword } = req.body;

    const user = await userService.getUserById(req.user.id, true)

    if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong password!');
    }
    newPassword = await bcrypt.hash(newPassword, 10);
    await userService.updateUserById(user.id, { password: newPassword });

    res.status(httpStatus.NO_CONTENT).send();
});

const deleteUser = catchAsync(async (req, res) => {
    if (req.user.id.toString() === req.params.userId) {
        await userService.deleteUserById(req.params.userId);
        res.status(httpStatus.NO_CONTENT).send();
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You have no permission to delete this user');
    }
});

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserCreatedRooms,
    changePassword
};
