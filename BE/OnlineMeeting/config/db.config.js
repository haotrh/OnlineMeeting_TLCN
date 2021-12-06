require('dotenv').config()
module.exports = {
  HOST: process.env.NODE_ENV.trim() === "development" ? "localhost" : process.env.DB_HOST,
  USER: process.env.NODE_ENV.trim() === "development" ? "postgres" : process.env.DB_USER,
  PASSWORD: process.env.NODE_ENV.trim() === "development" ? "0123456789qwe" : process.env.DB_PASSWORD,
  DB: process.env.NODE_ENV.trim() === "development" ? "testdb" : process.env.DB_DATABASE,
  dialect: process.env.NODE_ENV.trim() === "development" ? "postgres" : process.env.DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};