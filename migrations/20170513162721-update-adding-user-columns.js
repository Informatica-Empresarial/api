'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'avatar',{
        type: Sequelize.STRING,
        allowNull:true
    })
    .then(()=>{
      return queryInterface.addColumn('users', 'description',{
            type: Sequelize.TEXT,
            allowNull: true
        })      
    })
    .then(()=>{
      return queryInterface.addColumn('users', 'availability',{
            type: Sequelize.JSON,
            allowNull: true
        })      
    })    
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
