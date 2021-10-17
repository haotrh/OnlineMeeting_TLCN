const controller = require("../controllers/verifycode.controller");
const { verifyCode, authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/verify/code",
    [
      verifyCode.checkVerifyCode,
      verifyCode.checkVerifyCodeExpired
    ],
    controller.verify
  );
  
  app.post(
    "/api/verify/sendcode",
    controller.sendMail
  );
};