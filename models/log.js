'use strict';

module.exports = function(sequelize, DataTypes) {
  var log = sequelize.define('log', {
    uuid:  { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    accountUuid: { type: DataTypes.UUID, allowNull:true },
    userUuid: { type: DataTypes.UUID, allowNull:true },
    userEmail: { type: DataTypes.STRING, allowNull:true },    
    eventNumber: { type: DataTypes.DECIMAL, allowNull:true },
    eventText: { type: DataTypes.TEXT, allowNull:true }, 
    eventType: { type: DataTypes.STRING, allowNull:true }, 
    when: { type: DataTypes.DATE, defaultValue: DataTypes.NOW ,allowNull:true  },    
    exceptionType: { type: DataTypes.STRING, allowNull:true },
    exceptionText: { type: DataTypes.TEXT, allowNull:true },  
    level: { type: DataTypes.INTEGER, allowNull:true },
    json: { type: DataTypes.JSON, allowNull:true },    
  }, {
    classMethods: {
    }
  });

  return log;
};
