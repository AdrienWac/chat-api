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
        
      await queryInterface.addColumn('messages', 'created', { type: Sequelize.DataTypes.DATETIME, defaultValue: Sequelize.NOW, allowNull: false });
      
      await queryInterface.addColumn('messages', 'updated', { type: Sequelize.DataTypes.DATETIME, allowNull: true });
      
      await queryInterface.removeColumn('messages', 'reveiverId', { transaction: t });
      
      await queryInterface.removeColumn('messages', 'senderId', { transaction: t });
      
      await queryInterface.addColumn(
        'messages',
        'sender_id',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' }, allowNull: false }
      );

      await queryInterface.addColumn(
        'messages',
        'receiver_id',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' }, allowNull: false },

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

      await queryInterface.removeColumn('messages', 'created', { transaction: t });

      await queryInterface.removeColumn('messages', 'updated', { transaction: t });

      await queryInterface.removeColumn('messages', 'receiver_id', { transaction: t });

      await queryInterface.removeColumn('messages', 'sender_id', { transaction: t });

      await queryInterface.addColumn(
        'messages',
        'reveiverId',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' } }
      );

      await queryInterface.addColumn(
        'messages',
        'senderId',
        { type: Sequelize.DataTypes.INTEGER, references: { model: { tableName: 'users' }, key: 'id' } },
      );

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
   
  }
};
