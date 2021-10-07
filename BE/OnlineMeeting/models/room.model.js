module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("rooms", {
      host: {
        type: Sequelize.STRING,
        required: true
      },
      code: {
        required: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return Room;
  };