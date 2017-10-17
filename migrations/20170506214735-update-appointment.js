'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'appointments',
      'endDateTime',
      { allowNull: true,  type: Sequelize.DATE }
    ).then(()=>{
      return queryInterface.changeColumn(
        'appointments',
        'totalPrice',
        { allowNull: true,  type: Sequelize.BIGINT }
      )
    }).then(()=>{
      return queryInterface.changeColumn(
        'appointments',
        'status',
        { allowNull: false, type: Sequelize.STRING }
      )
    })
  },

  down: function (queryInterface, Sequelize) {
 
  }
};
