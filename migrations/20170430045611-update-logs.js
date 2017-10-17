'use strict';
var migrations = require("../lib/migrations.js");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface.sequelize.query("BEGIN TRANSACTION", {
          type: queryInterface.sequelize.QueryTypes.RAW
      }).then(()=>{
         console.log('BEGIN!!')
         return  queryInterface.renameColumn('logs', 'solutionUuid','objectUuid')
      })
      .then (()=>{
          console.log('COMMIT!!')
          return queryInterface.sequelize.query('COMMIT');        
      })
      .catch(()=>{

        queryInterface.sequelize.query('ROLLBACK')
      })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('logs', 'objectUuid', 'solutionUuid')
  }
};
