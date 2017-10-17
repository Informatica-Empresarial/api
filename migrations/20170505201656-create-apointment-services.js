'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('appointment_services', {
      uuid: { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      appointmentUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'appointments',
          key: 'uuid',
        }
      },
      serviceUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'services',
          key: 'uuid',
        }
      },
      count: { allowNull: false, type: Sequelize.INTEGER },
      price: { allowNull: false, type: Sequelize.DATE },

      createdAt:     { allowNull: false, type: Sequelize.DATE },
      updatedAt:     { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('appointment_services');
  }
};

