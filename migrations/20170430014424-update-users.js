'use strict';
var migrations = require("../lib/migrations.js");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'city', { type: Sequelize.STRING, allowNull: true })
      .then(function() {
        return queryInterface.addColumn('users', 'DNI', { type: Sequelize.STRING, allowNull: true })
      })
      .then(()=>{
        return queryInterface.renameColumn('users', 'knomaticAdmin', 'admin')
      })
      .catch(migrations.checkAlreadyExists)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'city')
        .then(() =>{
          return queryInterface.removeColumn('users', 'DNI')
        })
  }
};
