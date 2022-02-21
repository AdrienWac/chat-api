'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER
      },
      sessionId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      is_connected: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
