'use strict';

module.exports = function (sequelize, DataTypes) {
  var appointment_ratings = sequelize.define('appointment_ratings', {
      uuid: { allowNull: false, primaryKey: true, type: DataTypes.UUID , defaultValue: DataTypes.UUIDV4},
      rating: { allowNull: false, type: DataTypes.INTEGER },
      comments: { allowNull: true, type: DataTypes.TEXT },
      createdAt: { allowNull: false, type: DataTypes.DATE },
      updatedAt: { allowNull: false, type: DataTypes.DATE }
  }, {
    classMethods: {
      associate: function(models) {
        appointment_ratings.belongsTo(models.appointment, {
          foreignKey: 'appointmentUuid',
          onDelete: 'cascade'
        }),
        appointment_ratings.belongsTo(models.user, {
          foreignKey: 'userUuid',
          onDelete: 'cascade'
        })
      }
    }
  });

  return appointment_ratings;
};