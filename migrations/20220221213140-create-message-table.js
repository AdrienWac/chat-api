'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        defaultValue: false
      },
      sender_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      receiver_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('messages');
  }
};
