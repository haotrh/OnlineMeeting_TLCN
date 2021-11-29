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

db.user = require("../models/user.model")(sequelize, Sequelize);
db.room = require("../models/room.model")(sequelize, Sequelize);
db.guest_room = require("./guest_room.model")(sequelize, Sequelize);

//Associations
db.user.hasMany(db.room, { as: 'createdRooms', foreignKey: { allowNull: false, name: "hostId" }, onDelete: 'CASCADE' });
db.room.belongsTo(db.user, { as: 'host', foreignKey: { allowNull: false, name: "hostId" }, onDelete: 'CASCADE' });

db.user.belongsToMany(db.room, { through: db.guest_room, as: "invitedRooms", foreignKey: "guestId" })
db.room.belongsToMany(db.user, { through: db.guest_room, as: "guests" })

module.exports = db;