const Sequelize = require('sequelize');
const sequelize = require('./instance');
const fs = require('fs');
const path = require('path');

const db = {};

const basename = path.basename(__filename);

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf('.') !== 0) && (![basename, 'instance.js'].includes(file)) && (file.slice(-3) === '.js');
})
.forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;