'use strict';

module.exports = function(sequelize, DataTypes) {
  var group_service = sequelize.define('group_service', {
    uuid: { allowNull: false, type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  }, {
    classMethods: {
      associate: function(models) {
        models.group.belongsToMany(models.service, {
          through:    models.group_service,
          foreignKey: 'groupUuid'
        })

        models.service.belongsToMany(models.group, {
          through:    models.group_service,
          foreignKey: 'serviceUuid'
        })
      }
    }
  });

  return group_service;
};
