'use strict';
var migrations = require("../lib/migrations.js");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface.sequelize.query("BEGIN TRANSACTION", {
          type: queryInterface.sequelize.QueryTypes.RAW
      }).then(()=>{
         console.log('BEGIN!!')
         return  queryInterface.addColumn('accounts', 'TOS', { type: Sequelize.TEXT, allowNull: true })
      })
        .then(() =>{
          return queryInterface.addColumn('accounts', 'descriptions', { type: Sequelize.JSON, allowNull: false, defaultValue: {} })
        })
        .then(()=>{
          return queryInterface.addColumn('accounts', 'images', { type: Sequelize.JSON, allowNull: false, defaultValue: {} })
        })
        .then(()=>{
          console.log('COMMIT!!')
          return queryInterface.sequelize.query('COMMIT');
        })
        .catch(()=>{
          queryInterface.sequelize.query('ROLLBACK')
        })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('accounts', 'TOS')
      .then(()=>{
         return queryInterface.removeColumn('accounts', 'descriptions')
      })
      .then(()=>{
         return queryInterface.removeColumn('accounts', 'images')
      })
      .catch()
  }
};
