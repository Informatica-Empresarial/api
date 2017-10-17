'use strict';


module.exports = function (sequelize, DataTypes) {
  var appointment = sequelize.define('appointment', {
    uuid:          { type: DataTypes.UUID,    allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    status: { allowNull: false, type: DataTypes.ENUM('pre-scheduled','scheduled', 'delivered', 'canceled', 'blockedTime'),  defaultValue: 'scheduled' },
    startDateTime: { allowNull: false, type: DataTypes.DATE },
    endDateTime: { allowNull: true,  type: DataTypes.DATE },
    deleted: { allowNull: false,  type: DataTypes.BOOLEAN, defaultValue: false },
    location: { type: DataTypes.JSON, allowNull: false },
    hasDiscountCoupon: { allowNull: true,  type: DataTypes.BOOLEAN, defaultValue: false },
    discountCoupon: { allowNull: true,  type: DataTypes.STRING, defaultValue: false },
    currency:   { type: DataTypes.ENUM('COP', 'USD'), allowNull: true , defaultValue: 'COP' },
    totalPrice: { allowNull: true,  type: DataTypes.INTEGER },

    createdBy:    { type: DataTypes.STRING, allowNull: true },
    updatedBy:    { type: DataTypes.STRING, allowNull: true },
    createdAt:     { allowNull: false, type: DataTypes.DATE },
    updatedAt:     { allowNull: false, type: DataTypes.DATE },

  }, {
    classMethods: {
      associate: function(models) {
        appointment.belongsTo(models.user, {
          foreignKey: 'customerUuid',
          onDelete: 'cascade',
          as: 'customer'
        }),
        appointment.belongsTo(models.user, {
          foreignKey: 'specialistUuid',
          onDelete: 'cascade',
          as: 'specialist'
        }),
        appointment.hasMany(models.appointment_services, {as:'appointmentServices'})
        appointment.hasMany(models.appointment_ratings,  {as:'appointmentRatings'})
      }
    },
    instanceMethods: { 
      toJSON: function () {
        return {
          uuid:                 this.uuid,
          status:               this.status,
          startDateTime:        this.startDateTime,
          endDateTime:          this.endDateTime,
          location:             this.location,
          hasDiscountCoupon:    this.hasDiscountCoupon,
          discountCoupon:       this.discountCoupon,
          appointmentServices:  this.appointmentServices,
          appointmentRatings:   this.appointmentRatings,
          specialist:           this.specialist,
          customer:             this.customer,
          currency:             this.currency,
          totalPrice:           this.totalPrice,
          createdAt:            this.createdAt,
          updatedAt:            this.updatedAt
        }
      }      
    }
    
  });

  return appointment;
};
