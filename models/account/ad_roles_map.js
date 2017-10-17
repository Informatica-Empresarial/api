'use strict';

module.exports = function(sequelize, DataTypes) {
  var ad_roles_map = sequelize.define('ad_roles_map', {
    uuid: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    systemName: {
      allowNull: false,
      unique: false,
      type: DataTypes.STRING
    },
    activeDirectoryName: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    indexes: [
      { unique: true, fields: ['systemName', 'accountUuid'] }
    ],
    classMethods: {
      associate: function(models) {
        ad_roles_map.belongsTo(models.account, {
          foreignKey: 'accountUuid',
          onDelete: 'cascade'
        })
      }
    }
  });

  return ad_roles_map;
};
