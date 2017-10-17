'use strict';


module.exports = function (sequelize, DataTypes) {
  var device = sequelize.define('user_devices', {
    uuid:          { type: DataTypes.UUID,    allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    deviceUuid:    { type: DataTypes.STRING,  allowNull: false },
    platform:      { type: DataTypes.STRING,  allowNull: false },
    appIdentifier: { type: DataTypes.STRING,  allowNull: false },
    deviceData:    { type: DataTypes.JSON,    allowNull: true, defaultValue: {} },
  }, {
    classMethods: {
      associate: function(models) {
        device.belongsTo(models.user)
        device.belongsTo(models.account)
      }
    }
  });

  return device;
};
