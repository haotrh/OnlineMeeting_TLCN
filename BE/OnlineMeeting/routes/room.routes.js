const controller = require("../controllers/room.controller");
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
    "/api/room/create",
    [
      authJwt.verifyToken,
      verifyRoom.checkRoomPassword
    ],
    controller.create
  );
  
  app.post(
    "/api/room/delete",
    [
      authJwt.verifyToken,
      verifyRoom.checkRoomPassword
    ],
    controller.delete
  );


  app.post(
    "/api/room/join",
    [
      authJwt.verifyToken,
      verifyRoom.checkRoomPassword
    ],
    controller.join
  );

  app.post(
    "/api/room/quit",
    controller.quit
  );
};