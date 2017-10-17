'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('service_availabilities', {

      uuid: { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      serviceUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'services',
          key: 'uuid',
        },
        onDelete: 'cascade'
      },
      enabled: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
      lat : { type: Sequelize.DOUBLE, allowNull: false },
      long : { type: Sequelize.DOUBLE, allowNull: false },
      radius: { type: Sequelize.DOUBLE, allowNull: false },

      createdBy:    { type: Sequelize.STRING, allowNull: true },
      updatedBy:    { type: Sequelize.STRING, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('service_availability');
  }
};
