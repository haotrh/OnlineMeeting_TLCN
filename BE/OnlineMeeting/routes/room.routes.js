const controller = require("../controllers/room.controller");

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
    controller.create
  );
  
  app.post(
    "/api/room/delete",
    controller.delete
  );


  app.post(
    "/api/room/join",
    controller.join
  );

  app.post(
    "/api/room/quit",
    controller.quit
  );
};