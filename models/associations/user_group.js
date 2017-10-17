'use strict';

module.exports = function(sequelize, DataTypes) {
  var users_groups = sequelize.define('user_group', {
    uuid: { allowNull: false, type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  }, {
    classMethods: {
      associate: function(models) {
        models.group.belongsToMany(models.user, {
          through:    models.user_group,
          foreignKey: 'groupUuid'
        })

        models.user.belongsToMany(models.group, {
          through:    models.user_group,
          foreignKey: 'userUuid'
        })
      }
    }
  });

  return users_groups;
};
