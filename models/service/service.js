'use strict';


module.exports = function (sequelize, DataTypes) {
  var service = sequelize.define('service', {
    uuid:          { type: DataTypes.UUID,    allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    alias:         { type: DataTypes.STRING,  allowNull: true },
    name:          { type: DataTypes.STRING,  allowNull: false },
    description:   { type: DataTypes.TEXT, allowNull: true },
    items:        { type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true },
    tags:         { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    imageUrl:     { type: DataTypes.STRING, allowNull: true },
    instruction:  { type: DataTypes.TEXT, allowNull: true },
    currency:     { type: DataTypes.ENUM('COP', 'USD'), allowNull: false , defaultValue: 'COP' },
    price:        { type: DataTypes.BIGINT, allowNull: false },
    maxCount:     { type: DataTypes.BIGINT, allowNull: true, defaultValue:10 },
    order:        { type: DataTypes.INTEGER, allowNull: true, defaultValue:1},
    minutes_duration: { type: DataTypes.INTEGER, allowNull: false },
    enabled:      { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    createdBy:    { type: DataTypes.STRING, allowNull: true },
    updatedBy:    { type: DataTypes.STRING, allowNull: true },
    createdAt:     { allowNull: false, type: DataTypes.DATE },
    updatedAt:     { allowNull: false, type: DataTypes.DATE },

  }, {
    classMethods: {
      associate: function(models) {
        service.belongsTo(models.account, {
          foreignKey: 'accountUuid',
          onDelete: 'cascade'
        })
        service.hasMany(models.service_availabilities, {as:'serviceAvailabilities'})
      }
    }
  });

  return service;
};
