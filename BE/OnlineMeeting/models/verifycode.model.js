module.exports = (sequelize, Sequelize) => {
    const VerifyCode = sequelize.define("verifycodes", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      verifycode: {
        type: Sequelize.INTEGER 
      }
    });
  
    return VerifyCode;
};