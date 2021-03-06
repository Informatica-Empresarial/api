'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return  queryInterface.addColumn('users', 'address', { type: Sequelize.TEXT, allowNull: true })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('users', 'address')
  }
};
