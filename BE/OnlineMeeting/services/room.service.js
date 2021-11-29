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

        const activeRoom = global.roomList.get(roomId)

        if (activeRoom) {
            if (data.hasOwnProperty("allowScreenShare")) {
                if (data.allowScreenShare && !room.allowScreenShare) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOnScreenSharing" }, () => { }, true)
                }
                if (!data.allowScreenShare && room.allowScreenShare) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOffScreenSharing" }, () => { }, true)
                }
            }

            if (data.hasOwnProperty("allowChat")) {
                if (data.allowChat && !room.allowChat) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOnChat" }, () => { }, true)
                }
                if (!data.allowChat && room.allowChat) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOffChat" }, () => { }, true)
                }
            }

            if (data.hasOwnProperty("allowMicrophone")) {
                if (data.allowMicrophone && !room.allowMicrophone) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOnMicrophone" }, () => { }, true)
                }
                if (!data.allowMicrophone && room.allowMicrophone) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOffMicrophone" }, () => { }, true)
                }
            }

            if (data.hasOwnProperty("allowCamera")) {
                if (data.allowCamera && !room.allowCamera) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOnVideo" }, () => { }, true)
                }
                if (!data.allowCamera && room.allowCamera) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOffVideo" }, () => { }, true)
                }
            }

            if (data.hasOwnProperty("allowQuestion")) {
                if (data.allowQuestion && !room.allowQuestion) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOnQuestion" }, () => { }, true)
                }
                if (!data.allowQuestion && room.allowQuestion) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOffQuestion" }, () => { }, true)
                }
            }

            if (data.hasOwnProperty("allowRaiseHand")) {
                if (data.allowRaiseHand && !room.allowRaiseHand) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOnRaisehand" }, () => { }, true)
                }
                if (!data.allowRaiseHand && room.allowRaiseHand) {
                    await activeRoom.handleSocketRequest(null, { method: "host:turnOffRaisehand" }, () => { }, true)
                }
            }
        }
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
        order: [['createdAt', 'desc']],
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