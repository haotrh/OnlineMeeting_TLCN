const db = require("../models");
const Room = db.room;
const User = db.user;

// const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Save Room to Database
  Room.create({
    host: req.body.username
  })
    .then(room => {
          res.send({ message: "Room was created successfully!", data: room});
    })
    .catch(err => {
      res.status(500).send({ message: err.message, data: null });
    });
};

exports.delete = (req, res) => {
    // Save Room to Database
    Room.destroy({
        where: {
            id: req.body.roomId
        }
    })
      .then(room => {
            res.send({ message: "Room was deleted successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err.message, data: null });
      });
  };

exports.join = (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User not found." });
        }

        Room.findOne({
            where: {
              id: req.body.roomId
            }
          })
          .then(room => {
              if(!room) {
                return res.status(404).send({ message: "Room not found." });
              }

              user.setRooms([room.id]).then(() => {
                res.send({ message: "Join successfully!" });
              });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          })
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

exports.quit = (req, res) => {
User.findOne({
    where: {
    username: req.body.username
    }
})
    .then(user => {
    if (!user) {
        return res.status(404).send({ message: "User not found." });
    }

    Room.findOne({
        where: {
            id: req.body.roomId
        }
        })
        .then(room => {
            if(!room) {
            return res.status(404).send({ message: "Room not found." });
            }

            user.removeRooms([room.id]).then(() => {
            res.send({ message: "Quit successfully!" });
            });
        })
        .catch(err => {
        res.status(500).send({ message: err.message });
        })
    })
    .catch(err => {
    res.status(500).send({ message: err.message });
    });
};