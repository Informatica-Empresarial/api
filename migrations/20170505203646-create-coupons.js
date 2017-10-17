'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('discount_coupons', {
      uuid: { allowNull: false, primaryKey: true, type: Sequelize.UUID },
      coupon: { allowNull: false, type: Sequelize.STRING },
      redeemed: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
      discountPercentage: { allowNull: false, type: Sequelize.INTEGER },
      createdAt:     { allowNull: false, type: Sequelize.DATE },
      updatedAt:     { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('discount_coupons');
  }
};
