const httpStatus = require('http-status')
const { roomService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
    const user = req.user.dataValues
    const room = await roomService.createRoom({ hostId: user.id, ...req.body })
    res.status(httpStatus.CREATED).send(room)
})

const getRoom = catchAsync(async (req, res) => {
    const room = await roomService.getRoomById(req.params.id)
    res.send(room)
})


const update = catchAsync(async (req, res) => { })

const deleteRoom = catchAsync(async (req, res) => {
    const user = req.user
    const room = await roomService.getRoomById(req.params.id)
    if (user.hasCreatedRoom(room)) {
        await room.destroy()
        res.status(httpStatus.NO_CONTENT).send()
        return;
    }
    throw new ApiError(httpStatus.FORBIDDEN, "You have no permission")
})

module.exports = { create, update, deleteRoom, getRoom }