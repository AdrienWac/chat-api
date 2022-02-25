'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // https://sequelize.org/master/class/src/dialects/abstract/query-interface.js~QueryInterface.html#instance-method-createDatabase
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
      senderId: {
        type: Sequelize.INTEGER(11),
        references: {
          model: { tableName: 'users'},
          key: 'id'
        },
        allowNull: false
      },
      reveiverId: {
        type: Sequelize.INTEGER(11),
        references: {
          model: { tableName: 'users'},
          key: 'id'
        },
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('messages');
  }
};
