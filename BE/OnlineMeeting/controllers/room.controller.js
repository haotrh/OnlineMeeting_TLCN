const db = require("../models");
const Room = db.room;
const User = db.user;

// const Op = db.Sequelize.Op;

const makeUniqueCode = async() => {
  let roomCode  = await makeRandomCode()
  let count = await Room.count({ where: { code: roomCode } })
  while (count != 0) {
    roomCode = await makeRandomCode()
    count = await Room.count({ where: { code: roomCode } })
  }

  return roomCode
}

const makeRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        var firstString  = '';
        var secondString = '';
        for ( let i = 0; i < 5; i++ ) {
          firstString += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        for ( let i = 0; i < 5; i++ ) {
          secondString += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return (firstString + '-' + secondString)
        // console.log(`${firstString}-${secondString}`)
     }

exports.create = async(req, res) => {
  // Save Room to Database
  Room.create({
    host: req.body.username,
    code: await makeUniqueCode(),
    password: req.body.password
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
            code: req.body.code
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
              code: req.body.code
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
            code: req.body.code
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