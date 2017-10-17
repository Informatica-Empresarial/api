'use strict';


module.exports = function (sequelize, DataTypes) {
  var appointment = sequelize.define('discount_coupons', {
    uuid:          { type: DataTypes.UUID,    allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },

    coupon: { allowNull: false, type: DataTypes.STRING },
    redeemed: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
    discountPercentage: { allowNull: false, type: DataTypes.INTEGER },

    createdBy:    { type: DataTypes.STRING, allowNull: true },
    updatedBy:    { type: DataTypes.STRING, allowNull: true },
    createdAt:     { allowNull: false, type: DataTypes.DATE },
    updatedAt:     { allowNull: false, type: DataTypes.DATE },

  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return appointment;
};
