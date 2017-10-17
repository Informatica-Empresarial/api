import _ from 'lodash'
import models from '../models'
import log from './logsHelper'
import Uuid from 'uuid'

module.exports = {

  getDevices: function (userUuid, accountUuid, onlyDevices ) {

    let conditions = {
      accountUuid
    }

    if (userUuid) {
      conditions.userUuid = userUuid 
    }

    return new Promise((resolve, reject)=>{ 
      models.user_devices.findAll({
        where: conditions,
        include: models.user
      })
      .then(devices => {
        var response = devices
        if (onlyDevices) {
          response = _.map(devices, (device) =>{
            const {uuid, deviceUuid, platform, appIdentifier} = device
            return {uuid, deviceUuid, platform, appIdentifier}
          })
        }
        resolve(response) 
      })
      .catch( err => {
        reject(err)
      })

    })    
  },

  registerDevice: function (userUuid, deviceUuid, platform, appIdentifier, accountUuid , deviceData, userEmail) {
    return new Promise((resolve, reject)=>{ 

      let conditions = {
        accountUuid,
        deviceUuid,
        userUuid,
        appIdentifier
      }

      models.user_devices.findOne({
        where: conditions
      })
      .then(device => {
        if (!device) {
          const uuid = Uuid.v4()
          var device = models.user_devices.build({
            uuid: uuid,
            userUuid: userUuid,
            platform: platform,
            deviceUuid: deviceUuid,
            appIdentifier: appIdentifier,
            deviceData: deviceData,
            accountUuid: accountUuid
          })
          device.save()
            .then((device) => {
              log.createObject(accountUuid, uuid, '', userEmail, 'Device')
              return resolve(device)
            })
            .catch(err => {
              return reject(err)
            }) 
        } else {
          console.log('Device found : skipping register device actions')
          return reject('Device found : Failed to register device: Device already registered')
        }
      })
      .catch( err => {
        reject(err)
      })
    })
  },

  deleteDevice: function (userUuid, deviceUuid, accountUuid , userEmail) {
    return new Promise((resolve, reject)=> { 
        models.user_devices.findOne({
          where: {
            userUuid,
            deviceUuid,
            accountUuid
          }
        })
        .then(device => { 
          if (!device) {
            throw new Error('Cannot find such a device')
          }
          let destroy = device.destroy({force: true})
          resolve(destroy)
        })
        .catch( err =>{
          console.log(err)
          reject(err)
        })
    })
  },

  prepareAndroidNotificationDevices (devices) {
    const androidDevices = _.filter(devices, {'platform':'Android'})
    return _.map(androidDevices, 'deviceUuid')
  },

  prepareIOSNotificationDevices (devices) {
    const iosDevices = _.filter(devices, {'platform':'IOS'})
    return _.map(iosDevices, 'deviceUuid')
  }

}
