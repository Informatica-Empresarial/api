'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'services',
      'imageUrl',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'services',
      'imageUrl',
      {
        type: Sequelize.UUID,
        allowNull: true
      }
    )
  }
};
