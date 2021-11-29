const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RoomModel = sequelize.define("room", {
    id: {
      allowNull: false,
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    allowChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowMicrophone: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowCamera: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowScreenShare: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowRaiseHand: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowQuestion: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return RoomModel;
};