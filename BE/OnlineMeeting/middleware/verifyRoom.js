const db = require("../models");
const Room = db.room;

checkRoomPassword = (req, res, next) => {
  Room.findOne({
    where: {
      code: req.body.code
    }
  }).then(room => {
    if (!room) {
      res.send({
        message: "Room not found!"
      });
      return;
    }

    if (room.password != null || room.code != undefined) {
      if (room.password != req.body.password) {
        res.send({
          message: "Password is incorrect!"
        });
        return;
      }
    }

    next();
  });
};

const verifyRoom = {
  checkRoomPassword: checkRoomPassword
};

module.exports = verifyRoom;