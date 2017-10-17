'use strict';

module.exports = function (sequelize, DataTypes) {
  var appointment_services = sequelize.define('appointment_services', {
      uuid: { allowNull: false, primaryKey: true, type: DataTypes.UUID , defaultValue: DataTypes.UUIDV4},
      count: { allowNull: false, type: DataTypes.INTEGER },
      price: { allowNull: false, type: DataTypes.BIGINT },
      createdAt: { allowNull: false, type: DataTypes.DATE },
      updatedAt: { allowNull: false, type: DataTypes.DATE }
  }, {
    classMethods: {
      associate: function(models) {
        appointment_services.belongsTo(models.appointment, {
          foreignKey: 'appointmentUuid',
          onDelete: 'cascade'
        })
        appointment_services.belongsTo(models.service, {
          foreignKey: 'serviceUuid',
          onDelete: 'cascade'
        })
      }
    }
  });

  return appointment_services;
};