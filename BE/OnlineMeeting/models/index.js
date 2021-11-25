const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true, rejectUnauthorized: false
      }
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);

//Associations
db.user.hasMany(db.room, { as: 'createdRooms', foreignKey: { allowNull: false, name: "hostId" }, onDelete: 'CASCADE' });
db.room.belongsTo(db.user, { as: 'host', foreignKey: { allowNull: false, name: "hostId" }, onDelete: 'CASCADE' });

module.exports = db;