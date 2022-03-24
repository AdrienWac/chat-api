'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    const transaction = await queryInterface.sequelize.transaction();
    
    try {

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
        { transaction: transaction }
      );

      await queryInterface.addConstraint('users', { type: 'UNIQUE', fields: ['username'], name: 'unique_constraint_username', transaction: transaction });

      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
    }
    

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
