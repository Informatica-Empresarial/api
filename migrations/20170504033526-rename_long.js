'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface.renameColumn('service_availabilities', 'long','lng')
  },

  down: function (queryInterface, Sequelize) {
    return  queryInterface.renameColumn('service_availabilities', 'lng','long')
  }
};
