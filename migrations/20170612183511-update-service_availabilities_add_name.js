'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('service_availabilities', 'name',{
        type: Sequelize.STRING,
        defaultValue:''
      })
  },

  down: function (queryInterface, Sequelize) {

  }
};
