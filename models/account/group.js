'use strict';

module.exports = function(sequelize, DataTypes) {
  var group = sequelize.define('group', {
    uuid:                { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name:                { type: DataTypes.STRING },
    description:         { type: DataTypes.STRING, allowNull: true },
    isSystem:            { type: DataTypes.BOOLEAN, allnowNull: false, defaultValue: false},
    activeDirectoryName: { type: DataTypes.STRING }
  }, {
    classMethods: {
      associate: function(models) {
        group.belongsTo(models.account, {
          foreignKey: 'accountUuid',
          onDelete: 'cascade'
        })
      }
    }
  });

  return group;
};
