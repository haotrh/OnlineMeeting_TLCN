const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RoomModel = sequelize.define("Room", {
    id: {
      required: true,
      type: DataTypes.STRING,
      primaryKey: true,
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
    }
  });

  return RoomModel;
};