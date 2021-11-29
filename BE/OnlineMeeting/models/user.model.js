const { DataTypes } = require("sequelize");
const { cleanModelAttributes } = require("../utils/cleanModelAttributes");

module.exports = (sequelize) => {
  const secretColumns = ['password', 'verifyCode', 'provider']

  const UserModel = sequelize.define("user", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    verifyCode: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'credentials'
    }
  }, {
    defaultScope: {
      attributes: { exclude: secretColumns },
    },
    scopes: {
      withSecretColumns: {
        attributes: { include: secretColumns },
      },
    },
    hooks: {
      afterCreate: (record) => {
        cleanModelAttributes(record, secretColumns)
      },
      afterUpdate: (record) => {
        cleanModelAttributes(record, secretColumns)
      },
    }
  });

  UserModel.secretColumns = secretColumns

  return UserModel;
};