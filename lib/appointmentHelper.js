import Uuid from 'uuid'
import models from '../models'
import ErrorHandler from './error_handler'
import Utility from './utility'
import LogHelper from './logsHelper'
import _ from 'lodash'
import geolib from 'geolib'
import ServiceHelper from './serviceHelper'
import DateTimeHelper from './dateTimeHelper'
import Moment from 'moment'
import Constants from './constants'
import { extendMoment } from 'moment-range'
import aguid from 'aguid'

const moment = extendMoment(Moment)

class AppointmentHelper {

  getAppointments(accountUuid, query) {
    return new Promise((resolve,  reject) =>{
      const available = ['status', 'specialistUuid', 'customerUuid']
      var where = Utility.includeParams(available, query)
      if (!query.status){
        let defaultStatus = ['scheduled','delivered', 'started']
        _.assign(where, {
          status:{$in: defaultStatus}
        })
      }
      models.appointment.findAll({
          where: where,
          include: [
            {
              model: models.appointment_services,
              as: 'appointmentServices',
              include: models.service
            },
            {
              model: models.appointment_ratings,
              as: 'appointmentRatings'
            },
            {
              model: models.user,
              as: 'specialist'
            },
            {
              model: models.user,
              as: 'customer'
            }
          ]
        })
        .then(appointments =>{
            return resolve(appointments)
        })
        .catch(err =>{
          reject(err)
        })
    })
  }


  getByUuid(uuid) {

    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }

    return new Promise((resolve, reject) =>{
      models.appointment.findOne({
          where: {
              uuid
          },
          include: [
            {
              model: models.appointment_services,
              as: 'appointmentServices',
              include: models.service
            },
            {
              model: models.appointment_ratings,
              as: 'appointmentRatings'
            },
            {
              model: models.user,
              as: 'specialist'
            },
            {
              model: models.user,
              as: 'customer'
            }
          ]
      })
      .then (appointment =>{
        if (!appointment) {
          return reject('Unable to find the requested appointment')
        }
        return resolve(appointment)
      })
    })

  }  



  getByUuids(uuids) {
    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }
    return new Promise((resolve, reject) =>{
      models.appointment.findOne({
          where: {
              uuid: {$in:uuids}
          },
          include: [
            {
              model: models.appointment_services,
              as: 'appointmentServices'
            },
            {
              model: models.appointment_ratings,
              as: 'appointmentRatings'
            }
          ]
      })
      .then (appointments =>{
        if (!appointment) {
          return reject('Unable to find the requested appointment')
        }
        return resolve(appointments)
      })
    })
  }  



  buildAppointmentObject(appointment, services_count_array, location, getUsers = true, isScheduling = true, isSos = false) {

      let serviceUuids = _.map(services_count_array, 'serviceUuid')
      let requestedServices = null
      let totalDuration = 0
      let totalPrice = 0
      let appointment_services = []
      let {lat, lng} = location
      var latLongQuery = {latitude: lat, longitude: lng}
      var builtAppointmentObject = null
      var self = this

      return new Promise((resolve,  reject) =>{

        if (!services_count_array[0]) {
          return reject('Please provide a valid array of {serviceUuid, count} items')
        }

        ServiceHelper.getByUuids(serviceUuids)
        .then(services =>{
            requestedServices = services
            
          _.forEach(services, service =>{
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

              if (!isInside) {
                return reject(' One of the selected services is not available on the requested location service: ' + service.uuid)
              }

              let count = _.result(_.find(services_count_array, {serviceUuid:service.uuid}), 'count', 0)
              if (count > 0) {
                let appointment_service = {appointmentUuid: appointment.uuid, serviceUuid: service.uuid, price: service.price, count:count}
                appointment_services.push(appointment_service)
              } 
          })

          _.forEach(appointment_services, appointment_service =>{
              let selectedService = _.find(requestedServices, {uuid: appointment_service.serviceUuid})

              if (!selectedService) {
                return reject('Unable to find on of the requested services' + appointment_service.serviceUuid)
              }

              if (selectedService.maxCount < appointment_service.count) {
                return reject('The requested number of instances given for serviceUuid:' + appointment_service.serviceUuid 
                  + 'are greater than the max allowed requestedInstances: ' + appointment_service.count
                  + ' maxCount: ' +selectedService.maxCount
                )
              }

              totalPrice += (appointment_service.price * appointment_service.count)
              totalDuration += (selectedService.minutes_duration * appointment_service.count)
          })


          let startDateTime = appointment.startDateTime



          if (startDateTime) {
             console.log('StartdateTime retrieved -- ', startDateTime)
            if (startDateTime.toString().charAt(startDateTime.toString().length - 1) !== 'Z') {
              startDateTime = startDateTime + 'Z'
            }

            let endDateTime = DateTimeHelper.addTo(startDateTime, totalDuration, 'minutes')
            if (endDateTime) {
              appointment.endDateTime = moment(endDateTime).utc().format()
            } else {
              throw new Error('Unable to set endTime date for startTime' + startDateTime + 'and duration '+ totalDuration + ' minutes')
            }
          } else {
            if (isScheduling){
              throw new Error('Unable to find start time for the appointment --- scheduling enabled')
            }
          }


          appointment.appointment_services = appointment_services
          appointment.totalPrice = totalPrice
          appointment.totalDuration = totalDuration
          appointment.status = 'pre-scheduled'
          builtAppointmentObject = appointment
          return (getUsers) ? self.getSpecialistsForAppointment(appointment, isSos) : []
        })
        .then((specialists)=>{
          builtAppointmentObject.availableSpecialists = specialists
          if (appointment.specialistUuid && isScheduling) {
            console.log('Checking for collisions when scheduling')
            var specialistAppointments =  _.result(_.find(builtAppointmentObject.availableSpecialists, {uuid: appointment.specialistUuid}), 'specialistAppointments', [])
            if (specialistAppointments[0]) {
              let {hasCollision, collisionItem} = this.checkAppointmentCollision(appointment.startDateTime, appointment.endDateTime, specialistAppointments)
              if (hasCollision){
                return reject('The requested appointment has collision on startDate: '+ appointment.startDateTime + ' endDate: '+ appointment.endDateTime + 'CollisionItem: ' + JSON.stringify(collisionItem))
              }
            } else {
              console.log('Unable to check colissions --  there are no specialistAppointments for :' + appointment.specialistUuid)
            }
          }
          return resolve(builtAppointmentObject)
        })
        .catch(err =>{
           return reject(err)
        })
      })
  }

  checkAllowedTIme(AVAILABILITY_OBJECT, startTime, endTime){
    let day = moment(startTime).day()

    let available = false
    if (AVAILABILITY_OBJECT[day]){
      _.some(AVAILABILITY_OBJECT[day]['availability'], (validRange) =>{
        let startAvailable = moment(startTime).set({'hour': validRange.start.hour, 'minute':validRange.start.minute}).utc()
        let endAvailable = moment(startTime).set({'hour': validRange.end.hour, 'minute':validRange.end.minute}).utc()

        var startIsBetween = moment(startTime).isBetween(startAvailable, endAvailable, null, '[]')
        //console.log('Checking if ' + moment(startTime).tz('America/Bogota').format('YYYY-MM-DD HH:mm') + ' is in between start ' + startAvailable.tz('America/Bogota').format('YYYY-MM-DD HH:mm') + ' and end '+ endAvailable.tz('America/Bogota').format('YYYY-MM-DD HH:mm'))
        if (startIsBetween) {
           available = true
        }
        return available
      })
    }
    return available
  }


  getSpecialistAvailability(appointmentObject, specialists,  fromDateTime, toDateTime, minutesInterval, noAppointments=false, isSOS=false) {
      let {DEFAULT_AVAILABILITY, DEAD_TIME_BETWEEN_APPOINTMENTS} = Constants.all()
      var fromTime = moment(fromDateTime);
      var toTime = moment(toDateTime);
      var resultantAvailability = []
      var self = this
      console.log('starting to calculate available dates from -',  fromDateTime, ' to date ', toDateTime)
      var defaultNoAppointments = []
      _.forEach(specialists, specialist =>{
        var SPECIALIST_AVAILABILITY = (specialist.availability) ? specialist.availability : DEFAULT_AVAILABILITY
        var availabilityUUID = aguid(JSON.stringify(SPECIALIST_AVAILABILITY))
        var hasDefaultDataByAvailability = defaultNoAppointments[availabilityUUID]
        var validStartDateTimes = []
        var specialistAppointments =  _.result(_.find(appointmentObject.availableSpecialists, {uuid: specialist.uuid}), 'specialistAppointments', [])

        specialistAppointments = _.filter(specialistAppointments, appoinment =>{
          let isFuture = moment(appoinment.startDateTime).isAfter()
          return isFuture
        })

        // If you want an inclusive end date (fully-closed interval)

        if (specialistAppointments[0] || !hasDefaultDataByAvailability || isSOS) {
          for (var m = moment(fromTime); m.diff(toTime, 'minutes') <= 0; m.add(minutesInterval, 'minutes')) {
            var appointmentStart = m.utc().format()
            var isFutureDate = moment(appointmentStart).add(30, 'minutes').isAfter()
            if (!isFutureDate){
              continue
            }
            var totalAddedMinutes = appointmentObject.totalDuration 
            var appointmentEnding = moment(appointmentStart).add(totalAddedMinutes, 'minutes').utc().format()

            if (isSOS != true) {
              var isAllowedTime = self.checkAllowedTIme(SPECIALIST_AVAILABILITY, appointmentStart, appointmentEnding)
              if (!isAllowedTime){
                console.log('Skipping time -- not in the range ', appointmentStart)
                continue
              }
            }


            var isValid = true
            if (specialistAppointments[0]) {
              let {hasCollision, collisionItem} = this.checkAppointmentCollision(appointmentStart, appointmentEnding, specialistAppointments)
              if(hasCollision){
                console.log('Colission found on specialist -- ', specialist.uuid ,' -- Trying startTime--', appointmentStart, 'endTime --', appointmentEnding, '--ColissionItem--', collisionItem.uuid)
              }
              isValid = !hasCollision
            }
            if (isValid) {
              let date = {
                date: moment(appointmentStart).utc().format()
              }
              validStartDateTimes.push(date)
            }
          }

        }

        if (!specialistAppointments[0] && !defaultNoAppointments[availabilityUUID]) {
          defaultNoAppointments[availabilityUUID] = validStartDateTimes
        }


        if(!specialistAppointments[0] && defaultNoAppointments[availabilityUUID] && !isSOS) {
          console.log('No specialist appointments -- Using default value')
          specialist.validStartDateTimes = defaultNoAppointments[availabilityUUID]
        } else { 
          console.log('Specialist appointments -- Using calculated value')
          specialist.validStartDateTimes = validStartDateTimes
        }        


        delete specialist.specialistAppointments
        delete specialist.services

        if (specialist.validStartDateTimes.length > 0) {
          resultantAvailability.push(specialist)
        }

      })

      console.log('Finished  to calculate available dates', new Date())

      return resultantAvailability

  }

  filterUsersByLocation(users, location, distance, orderBy=true) {

    let validUsers = []

    _.forEach(users, user =>{
      let userLastLat =  _.result(user, 'lastKnownLocation.lat', false)
      let userLastLng =  _.result(user, 'lastKnownLocation.lng', false)
      ////We don´t have last known location of the user skip
      if (!userLastLat || !userLastLng) {
        return
      }

      let {lat, lng} = location
      var latLongQuery = {latitude: userLastLat, longitude: userLastLng}
      let distanceBetweenPoints = geolib.getDistance(latLongQuery, {latitude: lat, longitude: lng}, [1,1])

      if (distanceBetweenPoints > distance) {
        return
      }

      let jsonUser = user.toJSON()
      jsonUser.distance = distanceBetweenPoints
      validUsers.push(jsonUser)
    })

    if (orderBy) {
      validUsers = _.orderBy(validUsers, 'distance', 'asc')
    }

    return validUsers
  }

  checkAppointmentCollision(startDateTime, endDateTime, specialistAppointments) {
    let {DEAD_TIME_BETWEEN_APPOINTMENTS} = Constants.all().TIME_RANGES
    let hasCollision = false
    let collisionItem = null

    _.some(specialistAppointments, appointment=>{
       //console.log('Checking appointment -- startDate ', appointment.startDateTime)
       var currrentAppointmentEndDate = moment(appointment.endDateTime).add(0, 'minutes').utc().format()
       var availableDateRange = moment.range(startDateTime, endDateTime)
       var currentAppointmentRange = moment.range(appointment.startDateTime, currrentAppointmentEndDate)
       var olverlaps = availableDateRange.overlaps(currentAppointmentRange, {adjacent: true})
       

       console.log('Colission status overlaps -- ', olverlaps)

       if (olverlaps) {
          hasCollision = true
          console.log('Colission found  ', ' -- Appointment startTime--', appointment.startDateTime, 'appointment end time', appointment.endDateTime , 'checking against -- startTime', startDateTime ,'endTime --', endDateTime, '--ColissionItem--', appointment.uuid)
          collisionItem = appointment
       }

       return hasCollision
    })

    return {hasCollision, collisionItem}

  }


  getSpecialistsForAppointment(appointmentObject, isSos=false){
    return new Promise((resolve, reject) =>{
      let selectedServicesUuids = _.map(appointmentObject.appointment_services, 'serviceUuid')

      let where = {
          roles:{$contains:['ServiceSpecialistUser']},
          active: true
      }

      if (isSos) {
        _.assign(where, {
          SOS: true
        })
      }

      models.user.findAll({
        where: where,
        include:[
          {
            model: models.group,
            include: {
              model: models.service,
              where: {uuid:{$in:selectedServicesUuids}}
            }
          },
          {
            model: models.appointment,
            as:'specialistAppointments',
            required: false,
            where: {status:{$in:['scheduled','blocked','started']}}
          }
        ]
       // order:[{model: models.appointment, as: 'specialistAppointments'}, 'startDateTime', 'ASC']
      }).then(userServices =>{
 
        let allServicesUsers = _.filter(userServices, user=>{
          let services = _.chain(user.groups).map('services').flatten().value()
          user.services = services
          let serviceUuids = _.map(services, 'uuid')
          var serviceNotFound = false
          _.some(selectedServicesUuids, serviceUuid =>{
              if (serviceNotFound) {
                return true
              }
              serviceNotFound = (_.includes(serviceUuids, serviceUuid)) ? false : true
          })
          return (!serviceNotFound)
        })

        let response = _.map(allServicesUsers, user =>{
          delete user.groups
          return user
        })

        return resolve(response)
      })
      .catch(err =>{
        return reject(err)
      })
    })
  }

  create(appointment, appointmentServices,  user,  accountUuid) {
      let uuid = Uuid.v4()
      let self = this
      appointment.uuid = uuid
      const available = ['uuid','startDateTime', 'customerUuid', 'location','hasDiscountCoupon', 'discountCoupon', 'specialistUuid']
      var object = Utility.includeParams(available, appointment)

      if (user) {
        _.assign(object, {
          createdBy: user.uuid,
          updatedBy: user.uuid
        })
      }

      return new Promise ((resolve, reject) => {
        let appointmentObject
        let builtAppointment
        let builtAppointmentServices
        self.buildAppointmentObject(appointment, appointmentServices, appointment.location)
        .then(object=>{
          appointmentObject = object
          return models.sequelize.query("BEGIN TRANSACTION", {
              type: models.sequelize.QueryTypes.RAW
          })
        })
        .then(()=>{
              return models.appointment.create(appointmentObject)
          })
          .then(appointment =>{
              builtAppointment = appointment
              let createServicePromises = _.map(appointmentObject.appointment_services , appointment_service =>{
                return models.appointment_services.create(appointment_service)
              })
              return Promise.all(createServicePromises)
          })
          .then(appointment_services =>{
            builtAppointmentServices = appointment_services
            return models.sequelize.query("COMMIT", {
                type: models.sequelize.QueryTypes.RAW
            })                  
          })
          .then(() =>{
                return builtAppointment.reload({
                    include: [
                        {
                            model: models.appointment_services,
                            as: 'appointmentServices',
                            include: models.service
                        },
                        {
                            model: models.appointment_ratings,
                            as: 'appointmentRatings'
                        },
                        {
                            model: models.user,
                            as: 'specialist'
                        },
                        {
                            model: models.user,
                            as: 'customer'
                        }
                    ]
                })
            })
          .then(()=>{
              let response = builtAppointment.toJSON()
              return resolve(response)
          })
          .catch(err =>{
              models.sequelize.query("ROLLBACK", {
                  type: models.sequelize.QueryTypes.RAW
              }).then(()=>{
                return reject(err)
              })
          })
          ///End promise
      })
  }
  
  deleteByUuid(uuid) {
    if (!uuid) {
      return ErrorHandler.errorPromise('Please provide a valid Uuid')
    }

    return  models.appointment.destroy({
      where:{
        uuid
      },
        include: [
            {
                model: models.appointment_services,
                as: 'appointmentServices'
            },
            {
                model: models.appointment_ratings,
                as: 'appointmentRatings'
            }
        ]   
    })    
  }

  postAppointmentRating(appointmentUuid, rating, comments, userUuid) {
    return new Promise((resolve, reject) =>{

      var appointment = null

      if (!appointmentUuid) {
        return reject('Please provide a valid appointmentUuid')
      }

        models.appointment.findOne({
            where: {
                uuid: appointmentUuid
            }
        })
        .then (data =>{
          appointment = data

          if (!appointment) {
            return reject('Unable to find the requested appointment')
          }

          let build = {
            appointmentUuid,
            rating,
            comments: comments || '',
            userUuid
          }

          models.appointment_ratings.create(build)
          .then(appointment_rating =>{
            if (appointment_rating && appointment) {
              return resolve(appointment.reload({         
                include: [
                    {
                      model: models.appointment_services,
                      as: 'appointmentServices',
                      include: models.service
                    },
                    {
                      model: models.appointment_ratings,
                      as: 'appointmentRatings'
                    },
                    {
                      model: models.user,
                      as: 'specialist'
                    },
                    {
                      model: models.user,
                      as: 'customer'
                    }
                ]}))
            } else {
              return reject('Unable to create rating')
            }
          })
          .catch(err =>{
            return reject(err)
          })

        })
        .catch(err =>{
          return reject(err)
        })

    })
  }

}

export default new AppointmentHelper()
