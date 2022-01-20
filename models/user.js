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
        email: { type: DataTypes.STRING, allowNull: false },
        password: {
            type: DataTypes.STRING, allowNull: false, set(value) {
                this.setDataValue('password', hashPassword(value));
            }
        },
        username: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        firstname: { type: DataTypes.STRING, allowNull: false },
        is_active: { type: DataTypes.BOOLEAN, allowNull: false },
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