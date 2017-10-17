'use strict';
var migrations = require("../lib/migrations.js");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'SOS', { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false })
      .then(function() {
        return queryInterface.addColumn('users', 'lastKnownLocation', { type: Sequelize.JSON, allowNull: true , defaultValue: {}})
      })
      .then(()=>{
        return queryInterface.addColumn('users', 'active', { type: Sequelize.BOOLEAN, allowNull: true, defaultValue:true })
      })
      .catch(migrations.checkAlreadyExists)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'SOS')
        .then(() =>{
          return queryInterface.removeColumn('users', 'lastKnownLocation')
        })
        .then(()=>{
          return queryInterface.removeColumn('users', 'active')
        })
  }
};
