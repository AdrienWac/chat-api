const databaseConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    databaseConfig.DB,
    databaseConfig.USER,
    databaseConfig.PASSWORD,
    { host: databaseConfig.HOST, dialect: databaseConfig.dialect, pool: databaseConfig.pool }
);


module.exports = sequelize;