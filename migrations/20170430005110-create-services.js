'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('services', {
      uuid:         { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      alias:        { type: Sequelize.STRING, allowNull: false },
      name:         { type: Sequelize.STRING, allowNull: false },
      description:  { type: Sequelize.TEXT, allowNull: true },
      items:        { type: Sequelize.ARRAY(Sequelize.JSON), allowNull: true },
      tags:         { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: true },
      imageUrl:    { type: Sequelize.UUID, allowNull: true },
      instruction:  { type: Sequelize.TEXT, allowNull: true },
      currency:     { type: Sequelize.ENUM('COP', 'USD'), allowNull: false , defaultValue: 'COP' },
      price:        { type: Sequelize.BIGINT, allowNull: false },
      minutes_duration: { type: Sequelize.INTEGER, allowNull: false },
      enabled:      { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },

      createdBy:    { type: Sequelize.STRING, allowNull: true },
      updatedBy:    { type: Sequelize.STRING, allowNull: true },
      createdAt:     { allowNull: false, type: Sequelize.DATE },
      updatedAt:     { allowNull: false, type: Sequelize.DATE },

      accountUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'uuid',
        },
        onDelete: 'cascade'
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('services');
  }
};

