const db = require("../models")
const Room = db.room

const createRoom = async (body) => {
    const id = require('../utils/roomIdGenerator')()
    const room = await getRoomById(id)
    if (room) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Room with id is already taken');
    }
    return Room.create({ id, ...body })
}

const getRoomById = async (id) => {
    return Room.findOne({ where: { id } })
}

const updateRoomById = async (roomId, body) => {
    const user = await getRoomById(roomId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
    }
    await Room.update(body)
}

const deleteRoomById = async (userId) => {
    return Room.destroy({ where: { id: userId } })
}

module.exports = {
    createRoom, getRoomById, updateRoomById, deleteRoomById
}