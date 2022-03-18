'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();

    try {
        
      await queryInterface.addColumn('messages', 'created', { type: Sequelize.DataTypes.DATE, defaultValue: Sequelize.NOW, allowNull: false });
      
      await queryInterface.addColumn('messages', 'updated', { type: Sequelize.DataTypes.DATE, allowNull: true }, {transaction: transaction});
      
      await queryInterface.removeColumn('messages', 'reveiverId', { transaction: transaction });
      
      await queryInterface.removeColumn('messages', 'senderId', { transaction: transaction });
      
      await queryInterface.addColumn(
        'messages',
        'sender_id',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' }, allowNull: false },
        {transaction: transaction}
      );

      await queryInterface.addColumn(
        'messages',
        'receiver_id',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' }, allowNull: false },
        { transaction: transaction }
      );

      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw error;
    }

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.removeColumn('messages', 'created', { transaction: transaction });

      await queryInterface.removeColumn('messages', 'updated', { transaction: transaction });

      await queryInterface.removeColumn('messages', 'receiver_id', { transaction: transaction });

      await queryInterface.removeColumn('messages', 'sender_id', { transaction: transaction });

      await queryInterface.addColumn(
        'messages',
        'reveiverId',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' } },
        { transaction: transaction }
      );

      await queryInterface.addColumn(
        'messages',
        'senderId',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' } },
        { transaction: transaction }
      );

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
   
  }
};
