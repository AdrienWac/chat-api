'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = queryInterface.sequelize.transaction();

    try {

      await queryInterface.dropAllTables({transaction: transaction});

      await queryInterface.createTable('users', 
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER(11)
          },
          sessionId: {
            type: Sequelize.DataTypes.STRING,
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
        },
        {transaction: transaction}
      );

      await transaction.commit();

    } catch (error) {

      await transaction.rollback();

    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
