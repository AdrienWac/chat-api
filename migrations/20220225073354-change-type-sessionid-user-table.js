'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'sessionId', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    });
  },
};
