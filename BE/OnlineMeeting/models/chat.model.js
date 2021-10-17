module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define("chats", {
      username: {
        type: Sequelize.STRING,
        required: true
      },
      room: {
        type: Sequelize.STRING,
        required: true
      },
      message: {
        required: true,
        type: Sequelize.STRING
      }
    });
  
    return Chat;
  };