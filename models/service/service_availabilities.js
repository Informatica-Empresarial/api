'use strict';

module.exports = function (sequelize, DataTypes) {
  var service_availabilities = sequelize.define('service_availabilities', {
      uuid: { allowNull: false, primaryKey: true, type: DataTypes.UUID , defaultValue: DataTypes.UUIDV4},
      enabled: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
      name: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
      lat : { type: DataTypes.DOUBLE, allowNull: false },
      lng : { type: DataTypes.DOUBLE, allowNull: false },
      radius: { type: DataTypes.DOUBLE, allowNull: false },
      createdBy:    { type: DataTypes.STRING, allowNull: true },
      updatedBy:    { type: DataTypes.STRING, allowNull: true },
      createdAt: { allowNull: false, type: DataTypes.DATE },
      updatedAt: { allowNull: false, type: DataTypes.DATE }
  }, {
    classMethods: {
      associate: function(models) {
        service_availabilities.belongsTo(models.service, {
          foreignKey: 'serviceUuid',
          onDelete: 'cascade'
        })
      }
    }
  });

  return service_availabilities;
};