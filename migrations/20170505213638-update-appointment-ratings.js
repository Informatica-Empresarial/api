'use strict';
var migrations = require("../lib/migrations.js");

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('appointment_ratings', 'userUuid',{
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        }
      })
      .then(()=>{
        return  queryInterface.renameColumn('appointment_ratings', 'appoinmentUuid','appointmentUuid')
      })
      .catch(migrations.checkAlreadyExists)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('appointment_ratings', 'userUuid')
        .then(() =>{
          return queryInterface.renameColumn('appointment_ratings', 'appointmentUuid','appoinmentUuid')
        })
  }
};
