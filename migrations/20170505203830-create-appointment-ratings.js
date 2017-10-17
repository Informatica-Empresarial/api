'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('appointment_ratings', {
      uuid: { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      appoinmentUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'appointments',
          key: 'uuid',
        }
      },
      rating: { allowNull: false, type: Sequelize.INTEGER },
      comments: { allowNull: true, type: Sequelize.TEXT },
      
      createdAt:     { allowNull: false, type: Sequelize.DATE },
      updatedAt:     { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('appointment_ratings');
  }
};
