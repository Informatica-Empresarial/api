'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return  queryInterface.renameColumn('services', 'imageUuid','imageUrl')
  },

  down: function (queryInterface, Sequelize) {
     return  queryInterface.renameColumn('services', 'imageUrl','imageUuid')
  }
};
