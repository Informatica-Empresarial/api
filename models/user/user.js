'use strict';

var SALT_WORK_FACTOR = 10;
var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  var user = sequelize.define('user', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    admin: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: false
    },    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    workerAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    SOS: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    DNI: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true
    },
    lastKnownLocation: {
      type: DataTypes.JSON,
      allowNull: true
    },
    description: {
     type: DataTypes.TEXT,
     allowNull: true
    },
    supervisors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []      
    },
    phoneNumber:   { 
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Not provided"
    }
  }, {
    classMethods: {
      associate: function (models) {
        user.belongsTo(models.account)
        user.hasMany(models.user_devices)
        user.hasMany(models.appointment, {
          foreignKey:'customerUuid',
          as: 'customerAppointments'
        })
        user.hasMany(models.appointment, {
          foreignKey:'specialistUuid',
          as: 'specialistAppointments'
        })
      }
    },

    instanceMethods: {
      generateHash: function (password) {
        return bcrypt.hashSync(password, SALT_WORK_FACTOR);
      },

      comparePassword: function (password) {
        return bcrypt.compareSync(password, this.password)
      },

      authenticate: function (candidatePassword, cb) {
        return new Promise((resolve, reject) => {
          bcrypt.compare(candidatePassword, this.password, (err, res) => {
            if (err) {
              return reject(err);
            }
            return resolve(res);
          });
        });
      },

      toJSON: function () {
        return {
          uuid:          this.uuid,
          email:         this.email,
          roles:         this.roles,
          firstName:     this.firstName,
          lastName:      this.lastName,
          DNI:           this.DNI,
          phoneNumber:   this.phoneNumber,
          city:          this.city,
          admin:         this.admin,
          address:       this.address,
          workerAccount: this.workerAccount,
          supervisors: this.supervisors || [],
          specialistAppointments: this.specialistAppointments,
          validStartDateTimes: this.validStartDateTimes,
          avatar: this.avatar,
          description: this.description,
          lastKnownLocation: this.lastKnownLocation,
          SOS: this.SOS,
          groups: this.groups,
          devices: this.user_devices || [],
          active:    this.active,
          availability:    this.availability,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
        }
      }
    },

    hooks: {
      beforeValidate: function (user, options, next) {
        require('crypto').randomBytes(24, function (ex, buf) {
          if (!user.token) {
            user.token = buf.toString('hex');
          }
          next()
        });
      },

      beforeCreate: function (user) {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }

        if (!user.skipHash) {
          user.password = user.generateHash(user.password)
        }
      },

      beforeUpdate: function (user) {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }

        if (user.changed('password')) {
          user.password = user.generateHash(user.password)
        }
      }
    }
  });

  return user;
};
