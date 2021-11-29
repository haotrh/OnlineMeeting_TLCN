const httpStatus = require("http-status")
const { Op } = require("sequelize")
const db = require("../models")
const ApiError = require("../utils/ApiError")
const Room = db.room
const User = db.user
const GuestRooms = db.guest_room

const createRoom = async (body) => {
    const id = require('../utils/roomIdGenerator')()
    let room = await getRoomById(id)
    if (room) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Room with id is already taken');
    }
    const { guests, ...data } = body
    await Room.create({ id, ...data })
    room = await getRoomById(id)
    await room.addGuests(guests)
    await room.reload()
    return room
}

const getRoomById = async (id) => {
    return Room.findOne({
        where: { id }, include: [{
            model: User,
            as: "guests"
        }, {
            model: User,
            as: "host"
        }]
    })
}

const updateRoomById = async (roomId, body) => {
    let room = await getRoomById(roomId);
    if (!room) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
    }
    const { guests, ...data } = body

    await db.sequelize.transaction(async (t) => {
        await room.update(data, { transaction: t })
        await GuestRooms.destroy({
            where: {
                roomId
            }
        }, { transaction: t })
        await room.addGuests(guests, { transaction: t })
    })
    await room.reload()

    return room
}

const deleteRoomById = async (userId) => {
    return Room.destroy({ where: { id: userId } })
}

const getRooms = async (userId) => {
    const rooms = await Room.findAll({
        where: {
            [Op.or]: [
                { hostId: userId },
                { '$guests.guest_room.guestId$': userId },
            ]
        },
        include: [{
            model: User,
            as: "guests"
        }, {
            model: User,
            as: "host"
        }]
    })

    return rooms
}

module.exports = {
    createRoom, getRoomById, updateRoomById, deleteRoomById, getRooms
}