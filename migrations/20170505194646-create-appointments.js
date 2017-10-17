'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('appointments', {
      uuid:{ allowNull: false, primaryKey: true, type: Sequelize.UUID },
      customerUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        }
      },
      specialistUuid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uuid',
        }
      },
      status: { allowNull: false, type: Sequelize.ENUM('scheduled', 'delivered', 'canceled', 'blockedTime'),  defaultValue: 'scheduled' },
      startDateTime: { allowNull: false, type: Sequelize.DATE },
      endDateTime: { allowNull: false,  type: Sequelize.DATE },
      deleted: { allowNull: false,  type: Sequelize.BOOLEAN, defaultValue: false },
      location: { type: Sequelize.JSON, allowNull: false },
      hasDiscountCoupon: { allowNull: true,  type: Sequelize.BOOLEAN, defaultValue: false },
      discountCoupon: { allowNull: true,  type: Sequelize.STRING, defaultValue: false },
      currency:   { type: Sequelize.ENUM('COP', 'USD'), allowNull: false , defaultValue: 'COP' },
      totalPrice: { allowNull: false,  type: Sequelize.INTEGER },

      createdBy:    { type: Sequelize.STRING, allowNull: true },
      updatedBy:    { type: Sequelize.STRING, allowNull: true },
      createdAt:     { allowNull: false, type: Sequelize.DATE },
      updatedAt:     { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('appointments');
  }
};
