import Uuid from 'uuid'
import models from '../models'
import ErrorHandler from './error_handler'
import Utility from './utility'
import LogHelper from './logsHelper'
import _ from 'lodash'
import geolib from 'geolib'

class ServiceHelper {

  /**
   * 
   * 
   * @param {Uuid} accountId 
   * @returns <Services> All services
   * 
   * @memberOf ServiceHelper
   */

  getServices(accountUuid, query) {
    return new Promise((resolve,  reject) =>{

      var where = {accountUuid}
      var {enabled, currency, lat, lng, city} = query

      if (typeof enabled != 'undefined' || currency) {
         enabled = (enabled) ? enabled : true
        _.assign(where, {enabled, currency})
      }


      models.service.findAll({
          where: where,
          include: [{
              model: models.service_availabilities,
              as: 'serviceAvailabilities'
          }, models.group],
          order: [['order', 'ASC']]  
        })
        .then(services =>{
            ////Checks if the service mathches the given location
            let cityData = null

            if (city) {
               cityData = Utility.getCities({city}, 'name')
            }

            if (cityData && !lat && !lng) {
              lat = cityData.lat
              lng = cityData.lon
            }

            if (lat &&  lng) {
              var latLongQuery = {latitude: lat, longitude: lng}
              services = _.filter(services, service =>{
                 var isInside = false
                 _.some(service.serviceAvailabilities , av =>{
                    if (isInside) {
                      return true
                    }

                    if (av.lat && av.lng && av.radius) {
                      isInside = geolib.isPointInCircle(
                          latLongQuery,
                          {latitude: av.lat, longitude: av.lng},
                          av.radius
                      )
                    }

                 })
                 return isInside
              })
            } 

            return resolve(services)
        })
        .catch(err =>{
          reject(err)
        })
    })
  }


  getServiceByUuid(uuid) {

    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }

    return new Promise((resolve, reject) =>{
      models.service.findOne({
          where: {
              uuid
          },
          include: [{
            model: models.service_availabilities,
            as: 'serviceAvailabilities'
          }, models.group]
      })
      .then (service =>{
        if (!service) {
          return reject('Unable to find teh requested service')
        }
        return resolve(service)
      })
    })

  }  


  getServiceAvailanilitiesByUuid(uuid) {
    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }
    return new Promise((resolve, reject) =>{
      models.service_availabilities.findOne({
          where: {
              serviceUuid:uuid
          }
      })
      .then (service_availabilities =>{
        return resolve(service_availabilities)
      })
    })
  }  


  getByUuids(uuids) {
    if (!uuids) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }
    return new Promise((resolve, reject) =>{
      models.service.findAll({
          where: {
              uuid: {$in:uuids}
          },
          include: [{
            model: models.service_availabilities,
            as: 'serviceAvailabilities'
          }, models.group]
      })
      .then (service =>{
        if (!service) {
          return reject('Unable to find the requested service')
        }
        return resolve(service)
      })
    })
  }  

  create(accountUuid, alias, name, serviceAvailabilities, description, items, 
          tags, imageUrl, instruction, currency, price, minutes_duration, enabled, maxCount, groupUuids, user) {
      let uuid = Uuid.v4()
      const object = Utility.assignIfExist({}, {
        uuid,
        accountUuid, alias, name, description, items, tags, 
        imageUrl, instruction, currency, price, minutes_duration, enabled , serviceAvailabilities, maxCount
      })

      if (user) {
        _.assign(object, {
          createdBy: user.uuid,
          updatedBy: user.uuid
        })

        object.serviceAvailabilities =  _.map(serviceAvailabilities, data=>{
          return _.assign(data, {
              createdBy: user.uuid,
              updatedBy: user.uuid
            })
        })
      }

      return new Promise ((resolve, reject) => {
        models.service.create(object, {
          include: [{
            model: models.service_availabilities,
            as: 'serviceAvailabilities'
          }]
        }).then( service=>{

            if (groupUuids) {
              service.setGroups(groupUuids)
                .catch(() =>{
                  throw new Error('Invalid group Uuids')
                })
            }

            LogHelper.createObject(accountUuid, user.uuid, uuid, user.email, 'Service')
            return resolve (service)
        })
        .catch(err =>{
          reject(err)
        })
      })

  }
  
  
  deleteByUuid(uuid) {
    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }

    return  models.service.destroy({
      where:{
        uuid
      },
      include: [{
        model: models.service_availabilities,
        as: 'serviceAvailabilities'
      }]      
    })    
  }

  
  deleteAvailabilityByUuid(uuid) {
    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }
    return  models.models.service_availabilities.destroy({
      where:{
        uuid
      }  
    })    
  }


  updateByUuid(uuid, alias, name, order ,serviceAvailabilities , description, items, 
                tags, imageUrl, instruction, currency, price, minutes_duration, enabled, maxCount, groupUuids ,user) {
    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }
    
    return new Promise((resolve, reject) =>{
      models.service.findOne({
          where: {
              uuid
          },
          include: [{
            model: models.service_availabilities,
            as: 'serviceAvailabilities'
          }, models.group]
      })
      .then (service =>{
        if (!service) {
          return reject('Unable to find the requested service')
        }


        if (groupUuids) {
          service.setGroups(groupUuids)
            .catch(() =>{
              throw new Error('Invalid group Uuids')
            })
        }

        const object = Utility.assignIfExist(service, {
          alias, name, order,description, items, tags, 
          imageUrl, instruction, currency, price, minutes_duration, enabled , serviceAvailabilities, maxCount
        })

        if (user) {
          _.assign(object, {
            updatedBy: user.uuid
          })
        }

        _.assign(service, object)

        if (serviceAvailabilities) {
          let createPromises = _.map(serviceAvailabilities, data =>{
               delete data.uuid
               data.serviceUuid = service.uuid
               return models.service_availabilities.create(data)
          })

          return new Promise((resolve, reject) =>{
             models.service_availabilities.destroy({
               where: {serviceUuid:service.uuid}
             }).then(()=>{
               Promise.all(createPromises).then(data =>{
                 service.serviceAvailabilities = data
               })
               .then(() =>{
                   return resolve(service.save())
               })
             })
          })
          
        } else {
         return service.save()
        }

      })
      .then(service =>{
         LogHelper.createObject(user.accountId, user.uuid, uuid, user.email, 'Service')
         return  resolve (service)
      })
    })
  }



}

export default new ServiceHelper()
