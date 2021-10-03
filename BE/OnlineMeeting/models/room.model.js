module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("rooms", {
      host: {
        type: Sequelize.STRING
      }
    });
  
    return Room;
  };