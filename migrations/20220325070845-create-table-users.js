'use strict';

const path = require('path');

module.exports = {
  async up (queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.dropAllTables({ transaction: t, skip: ['SequelizeMeta']});

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
          },
          created: {
            type: Sequelize.DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
          },
          updated: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          }
        },
        {transaction: t}
      );

      await t.commit();

    } catch (error) {

      await t.rollback();
      throw new Error(`Impossible de lancer la migration ${path.basename(__filename)}. ${error.message}`);

    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
