'use strict';

const constraintName = 'unique_constraint_username';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    try{
      // const result = await sequelize.transaction(async (t) => {
      const result = await queryInterface.sequelize.transaction(async (t) => {

        await queryInterface.addConstraint('users', {type: 'UNIQUE', fields: ['username'], name: constraintName, transaction: t });

      });

    } catch(error) {

      console.log(`Error during migration unique 20220318211905-add-constraint-unique-to-username.js ${error.message}. Transaction has already been rolled back automatically by Sequelize!`);

    }

  },

  async down (queryInterface, Sequelize) {
    try {
      // const result = await sequelize.transaction(async (t) => {
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.removeConstraint('users', constraintName, {transaction: t});
      })
  
    } catch (error) {
      
    }



  }
};
