const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,       // taskdb
  process.env.DB_USER,       // postgres
  process.env.DB_PASSWORD,   // your password from .env
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
  }
);

module.exports = sequelize;
