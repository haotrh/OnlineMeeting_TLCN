const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);

// Indicate that the user model can belong to many Roles and vice versa
// With through, foreignKey, otherKey, 
// we’re gonna have a new table user_roles as connection 
// between users and roles table via their primary key as foreign keys.
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.room.belongsToMany(db.user, {
  through: "user_rooms",
  foreignKey: "roomId",
  otherKey: "userId",
  onDelete: 'cascade'
});
db.user.belongsToMany(db.room, {
  through: "user_rooms",
  foreignKey: "userId",
  otherKey: "roomId",
  onDelete: 'cascade'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;