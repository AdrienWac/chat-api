'use strict';
const { Model } = require('sequelize');
const User = require('./user');

module.exports = (sequelize, DataTypes) => {

    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models['User'], { as: 'Sender', foreignKey: 'sender_id'});
            this.belongsTo(models['User'], { as: 'Receiver', foreignKey: 'receiver_id'});
        }

    };

    Message.init({
        // TODO Écrire une validation pour vérifier que la valeur ne contient pas de HTML
        content: { type: DataTypes.TEXT, allowNull: false },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE, allowNull: true},
        // TODO Écrire une validation pour vérifier que les valeurs est bien un identifiant existant
        // TODO remettr les references à la table User
        sender_id: { type: DataTypes.INTEGER,  },
        receiver_id: { type: DataTypes.INTEGER,  },
    }, {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
    });

    return Message;

};