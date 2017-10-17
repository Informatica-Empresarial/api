'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('group_services', {
      uuid: { allowNull: false, primaryKey: true, type: Sequelize.UUID },

      groupUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'groups',
          key: 'uuid',
        },
        onDelete: 'cascade'
      },

      serviceUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'services',
          key: 'uuid',
        },
        onDelete: 'cascade'
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('group_services');
  }
};

