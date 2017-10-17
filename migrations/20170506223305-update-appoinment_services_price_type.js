'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
          'appointment_services',
          'price'
        ).then(()=>{
            return queryInterface.addColumn('appointment_services', 'price', { allowNull: false, type: Sequelize.BIGINT })
        })
  },

  down: function (queryInterface, Sequelize) {

  }
};
