'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

    };

    User.init({
        sessionId: { type: DataTypes.STRING, allowNull: true },
        username: { type: DataTypes.STRING, allowNull: false },
    }, {
        sequelize,
        modelName: 'User',
    });

    return User;

};


function hashPassword(password) {

    const bcrypt = require('bcryptjs');

    const saltRounds = 10;

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    return hashedPassword;

}