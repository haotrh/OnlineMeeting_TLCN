const db = require("../models");
// const Room = db.room;
// const User = db.user;
const Chat = db.chat;

// const Op = db.Sequelize.Op;

exports.sendMessage = async(req, res) => {
  // Save message to Database
  Chat.create({
    message: req.body.message,
    username: req.body.username,
    room: req.body.code
  })
    .then(chat => {
          res.send({ message: "Send message successfully!", data: chat});
    })
    .catch(err => {
      res.status(500).send({ message: err.message, data: null });
    });
};

exports.sendSocketMessage = (message) => {
  return new Promise((resolve) => {
    Chat.create({
      message: message.message,
      username: message.username,
      room: message.code
    })
      .then(chat => {
        resolve(chat);
      })
      .catch(err => {
        throw err
      });
  })
}

exports.loadMessage = async(req, res) => {
  // Load message from Database
  Chat.findAll({
    where: {
      room: req.body.code
    },
    order: [
      ['id', 'ASC'],
      ['createdAt', 'ASC'],
      ['updatedAt', 'ASC']
    ],
    attributes: ['id','username','message','createdAt']
  })
    .then(chat => {
          res.send({ message: "Load message successfully!", data: chat});
    })
    .catch(err => {
      res.status(500).send({ message: err.message, data: null });
    });
};

exports.loadSocketMessage = (code) => {
  return new Promise((resolve) => {
    Chat.findAll({
      where: {
        room: code
      },
      order: [
        ['createdAt', 'ASC']
      ],
      attributes: ['username','message','createdAt']
    })
      .then(chat => {
        resolve(chat);
      })
      .catch(err => {
        throw err
      });
  })
}

// exports.delete = (req, res) => {
//     // Save Room to Database
//     Room.destroy({
//         where: {
//             code: req.body.code
//         }
//     })
//       .then(room => {
//             res.send({ message: "Room was deleted successfully!" });
//       })
//       .catch(err => {
//         res.status(500).send({ message: err.message, data: null });
//       });
//   };

// exports.join = (req, res) => {
//     User.findOne({
//       where: {
//         username: req.body.username
//       }
//     })
//       .then(user => {
//         if (!user) {
//           return res.status(404).send({ message: "User not found." });
//         }

//         Room.findOne({
//             where: {
//               code: req.body.code
//             }
//           })
//           .then(room => {
//               if(!room) {
//                 return res.status(404).send({ message: "Room not found." });
//               }

//               user.setRooms([room.id]).then(() => {
//                 res.send({ message: "Join successfully!" });
//               });
//           })
//           .catch(err => {
//             res.status(500).send({ message: err.message });
//           })
//       })
//       .catch(err => {
//         res.status(500).send({ message: err.message });
//       });
// };

// exports.quit = (req, res) => {
// User.findOne({
//     where: {
//     username: req.body.username
//     }
// })
//     .then(user => {
//     if (!user) {
//         return res.status(404).send({ message: "User not found." });
//     }

//     Room.findOne({
//         where: {
//             code: req.body.code
//         }
//         })
//         .then(room => {
//             if(!room) {
//             return res.status(404).send({ message: "Room not found." });
//             }

//             user.removeRooms([room.id]).then(() => {
//             res.send({ message: "Quit successfully!" });
//             });
//         })
//         .catch(err => {
//         res.status(500).send({ message: err.message });
//         })
//     })
//     .catch(err => {
//     res.status(500).send({ message: err.message });
//     });
// };