'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('user_meta', {
      uuid: { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      userUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        },
        onDelete: 'cascade'
      },
      key: { allowNull: false, type: Sequelize.STRING },
      value: { allowNull: true,  type: Sequelize.TEXT },
      JSON_value: { allowNull: true,  type: Sequelize.JSON },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('user_meta');
  }
};
