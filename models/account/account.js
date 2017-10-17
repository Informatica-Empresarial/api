'use strict';

var models = require('../index');

module.exports = function (sequelize, DataTypes) {
  var account = sequelize.define('account', {
    uuid:                   { type: DataTypes.UUID,    allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name:                   { type: DataTypes.STRING,  allowNull: false, unique: true },
    isDemo:                 { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    descriptions:           { type: DataTypes.JSON,    allowNull: true },
    TOS:                    { type: DataTypes.TEXT,    allowNull: true },
    images:                 { type: DataTypes.JSON,    allowNull: true },
    publicKey:              { type: DataTypes.TEXT },
    fileServerHostName:     { type: DataTypes.STRING },
    remoteAuthUrl:          { type: DataTypes.STRING }
  }, {
    classMethods: {
      associate: function (models) {
        account.hasMany(models.user, {
          foreignKey: 'accountUuid',
          onDelete: 'cascade'
        });

        account.hasMany(models.ad_roles_map, { foreignKey: 'accountUuid', onDelete: 'cascade' });
        account.hasMany(models.group, { foreignKey: 'accountUuid', onDelete: "cascade" });
      }
    },

    instanceMethods: {
      getSystemGroup () {
        return models.group.findOrCreate({
            where: {
              name: 'Everyone',
              accountUuid: this.uuid,
              isSystem: true
            }
          })
          .spread((group, created) => {
            return group;
          })
      },

      updateSystemGroup () {
        var groupPromise = this.getSystemGroup();
        var usersPromise = this.getUsers();

        return Promise.all([
          groupPromise, usersPromise
        ])
          .then(function (results) {
            var group = results[0];
            var users = results[1];

            return group.setUsers(users);
          })
      }
    }
  });

  return account;
};
