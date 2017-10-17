'use strict';


module.exports = function (sequelize, DataTypes) {
  var user_meta = sequelize.define('user_meta', {
    uuid:          { type: DataTypes.UUID,    allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    key: { allowNull: false, type: DataTypes.STRING },
    value: { allowNull: true,  type: DataTypes.TEXT },
    JSON_value: { allowNull: true,  type: DataTypes.JSON }
  }, {
    classMethods: {
      associate: function(models) {
        user_meta.belongsTo(models.user, {
          foreignKey: 'userUuid',
          onDelete: 'cascade'
        })
      }
    }
  });

  return user_meta;
};
