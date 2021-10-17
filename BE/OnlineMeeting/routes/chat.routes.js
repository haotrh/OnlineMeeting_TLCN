const controller = require("../controllers/chat.controller");
const { verifyRoom, authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/chat/send",
    // [
    //   authJwt.verifyToken,
    //   verifyRoom.checkRoomPassword
    // ],
    controller.sendMessage
  );

  app.post(
    "/api/chat/load",
    // [
    //   authJwt.verifyToken,
    //   verifyRoom.checkRoomPassword
    // ],
    controller.loadMessage
  );
};