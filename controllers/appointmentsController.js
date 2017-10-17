import AppointmentHelper from '../lib/appointmentHelper'
import Utility from '../lib/utility'
import DateTimeHelper from '../lib/dateTimeHelper'
import Boom from 'boom'
import _ from 'lodash'
import Uuid from 'uuid'
import Constants from '../lib/constants'
import moment from 'moment'
import models from '../models'
import NotificationHelper from '../lib/notificationHelper'

class AppointmentsController { 

    index(request, reply) {
        const accountId = request.auth.credentials.accountId
        const payload = _.assign(request.query, request.payload, request.params)
        
        AppointmentHelper.getAppointments(accountId, payload)
        .then(appointment =>{
           return reply(appointment)
        })
        .catch( err => {
           console.log(err)
           return reply(Boom.badRequest(err))
        }) 

    }

    create(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        const accountUuid = request.auth.credentials.accountId
        const user = request.auth.credentials
        const appointmentServices = request.payload.appointmentServices
        AppointmentHelper.create(payload, appointmentServices, user,  accountUuid)
        .then((appointment)=>{
            return reply(appointment)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })
    }

    getByUuid(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        AppointmentHelper.getByUuid(payload.uuid)
        .then(appointment =>{
            return reply(appointment)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    schedule(request, reply) {
        const {NOTIFICAIONS} = Constants.all()

        AppointmentHelper.getByUuid(request.params.uuid)
        .then(appointment =>{
            appointment.status = 'scheduled'
            return appointment.save()
        })
        .then(appointment =>{
            //Send user notification
            let customerUuid = [appointment.customer.uuid]
            let specialistUuid = [appointment.specialist.uuid]
            console.log('Attepmting to notify customer ', customerUuid)
            console.log('Attepmting to notify specialist ', specialistUuid)

            if (NOTIFICAIONS['NOTIFICATIONS_ENABLED'] && NOTIFICAIONS['SCHEDULED_CUSTOMER']['active'] === true && customerUuid) {
                let {titleAux, messageAux, additionalPayload, IOS, Android} = NOTIFICAIONS['SCHEDULED_CUSTOMER']
                NotificationHelper.sendNotificationPack(appointment.uuid, customerUuid, IOS, Android, titleAux, messageAux, additionalPayload, request.auth.credentials.accountId)
                .then(response =>{
                    console.log('Sending notification ', 'SCHEDULED_CUSTOMER')
                    console.log(response)
                })
            }

            if (NOTIFICAIONS['NOTIFICATIONS_ENABLED'] && NOTIFICAIONS['SCHEDULED_SPECIALIST']['active'] === true && specialistUuid && !request.payload.sos && !request.query.sos) {
                let {titleAux, messageAux, additionalPayload, IOS, Android} = NOTIFICAIONS['SCHEDULED_SPECIALIST']
                NotificationHelper.sendNotificationPack(appointment.uuid, specialistUuid, IOS, Android, titleAux, messageAux, additionalPayload, request.auth.credentials.accountId)
                .then(response =>{
                    console.log('Sending notification ', 'SCHEDULED_SPECIALIST')
                    console.log(response)
                })
            }



            if (request.payload.sos == true || request.query.sos == true) {
                if (NOTIFICAIONS['NOTIFICATIONS_ENABLED'] && NOTIFICAIONS['SOS_SPECIALIST']['active'] === true && customerUuid) {
                    let {titleAux, messageAux, additionalPayload, IOS, Android} = NOTIFICAIONS['SOS_SPECIALIST']
                    NotificationHelper.sendNotificationPack(appointment.uuid, specialistUuid, IOS, Android, titleAux, messageAux, additionalPayload, request.auth.credentials.accountId)
                    .then(response =>{
                        console.log('Sending notification ', 'SOS_SPECIALIST')
                        console.log(response)
                    })
                }                
            }



            return reply(appointment)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    start(request, reply) {
        AppointmentHelper.getByUuid(request.params.uuid)
        .then(appointment =>{
            appointment.status = 'started'
            return appointment.save()
        })
        .then(appointment =>{
            return reply(appointment)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    cancel(request, reply) {
        const {NOTIFICAIONS} = Constants.all()

        AppointmentHelper.getByUuid(request.params.uuid)
        .then(appointment =>{
            appointment.status = 'canceled'
            return appointment.save()
        })
        .then(appointment =>{

            //Send user notification
            let customerUuid = [appointment.customer.uuid]
            let specialistUuid = [appointment.specialist.uuid]
            console.log('Attepmting to notify customer ', customerUuid)
            console.log('Attepmting to notify specialist ', specialistUuid)

            let userCancelled = (request.auth.credentials.uuid === appointment.customer.uuid) ? true : false
            let specialistCancelled = (request.auth.credentials.uuid === appointment.specialist.uuid) ? true : false


            if (NOTIFICAIONS['NOTIFICATIONS_ENABLED'] && NOTIFICAIONS['CANCELED_USER']['active'] === true && customerUuid && !userCancelled) {
                let {titleAux, messageAux, additionalPayload, IOS, Android} = NOTIFICAIONS['CANCELED_USER']
                NotificationHelper.sendNotificationPack(appointment.uuid, customerUuid, IOS, Android, titleAux, messageAux, additionalPayload, request.auth.credentials.accountId)
                .then(response =>{
                    console.log('Sending notification ', 'CANCELED_USER')
                    console.log(response)
                })
            }

            if (NOTIFICAIONS['NOTIFICATIONS_ENABLED'] && NOTIFICAIONS['CANCELED_SPECIALIST']['active'] === true && specialistUuid && !specialistCancelled) {
                let {titleAux, messageAux, additionalPayload, IOS, Android} = NOTIFICAIONS['CANCELED_SPECIALIST']
                NotificationHelper.sendNotificationPack(appointment.uuid, specialistUuid, IOS, Android, titleAux, messageAux, additionalPayload, request.auth.credentials.accountId)
                .then(response =>{
                    console.log('Sending notification ', 'CANCELED_SPECIALIST')
                    console.log(response)
                })
            }


            return reply(appointment)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    deliver(request, reply) {
        const {NOTIFICAIONS} = Constants.all()
        AppointmentHelper.getByUuid(request.params.uuid)
        .then(appointment =>{
            appointment.status = 'delivered'
            return appointment.save()
        })
        .then(appointment =>{

            //Send user notification
            let customerUuid = [appointment.customer.uuid]
            let specialistUuid = [appointment.specialist.uuid]
            console.log('Attepmting to notify customer ', customerUuid)
            console.log('Attepmting to notify specialist ', specialistUuid)


            if (NOTIFICAIONS['NOTIFICATIONS_ENABLED'] && NOTIFICAIONS['RATE_USER']['active'] === true && customerUuid) {
                let {titleAux, messageAux, additionalPayload, IOS, Android} = NOTIFICAIONS['RATE_USER']
                NotificationHelper.sendNotificationPack(appointment.uuid, customerUuid, IOS, Android, titleAux, messageAux, additionalPayload, request.auth.credentials.accountId)
                .then(response =>{
                    console.log('Sending notification ', 'RATE_USER')
                    console.log(response)
                })
            }


            return reply(appointment)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    delete(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        AppointmentHelper.deleteByUuid(payload.uuid)
        .then(response =>{
            return reply(response)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    getAvailability(request,  reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        const {DEFAULT_AVAILABILITY} = Constants.all()
        const {DEFAULT_AVAILABILITY_OFFER_TIME, AVAILABILITY_RANGE_FACTOR, DEAD_TIME_BETWEEN_APPOINTMENTS} = Constants.all().TIME_RANGES

        let fromDateTime = (payload.fromDateTime) ? DateTimeHelper.round(payload.fromDateTime, AVAILABILITY_RANGE_FACTOR) : DateTimeHelper.round(new Date(), AVAILABILITY_RANGE_FACTOR)
        let toDateTime = (payload.toDateTime) ? 
            DateTimeHelper.round(payload.toDateTime, AVAILABILITY_RANGE_FACTOR) : 
            DateTimeHelper.round(DateTimeHelper.addTo(new Date(), DEFAULT_AVAILABILITY_OFFER_TIME), AVAILABILITY_RANGE_FACTOR)

        let {lat, lng, appointmentServices} = request.payload
        let appointment = {uuid:Uuid.v4()}
        let getUsers = true /// get available users
        let isScheduling = false /// Avoid building appointment validations
        AppointmentHelper.buildAppointmentObject(appointment, appointmentServices, {lat, lng}, getUsers, isScheduling)
        .then(builtAppointmentObject =>{
            let specialists = builtAppointmentObject.availableSpecialists 

            if (payload.specialistUuid) {
                specialists = _.filter(specialists, {uuid:payload.specialistUuid})
            }
            
            let availability = AppointmentHelper.getSpecialistAvailability(builtAppointmentObject, specialists,  
                                    fromDateTime, toDateTime, 30)
            builtAppointmentObject.availableSpecialists = availability 
            builtAppointmentObject.location = {lat, lng}                          

           return reply(builtAppointmentObject)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))          
        })

    }


    getAvailabilitySOS(request,  reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        const {DEFAULT_WAITING_TIME_TO_START_SOS, AVAILABILITY_RANGE_FACTOR} = Constants.all().TIME_RANGES
        const {SOS_MAX_RADIUS} = Constants.all().DISTANCE_RANGES
        const fromDateTime = DateTimeHelper.round(moment().add(DEFAULT_WAITING_TIME_TO_START_SOS, 'minutes').utc().format(), AVAILABILITY_RANGE_FACTOR)
        

        let {lat, lng, appointmentServices} = request.payload
        let appointment = {uuid:Uuid.v4()}
        let getUsers = true /// get available users
        let isScheduling = false /// Avoid building appointment validations
        let isSOS = true
        AppointmentHelper.buildAppointmentObject(appointment, appointmentServices, {lat, lng}, getUsers, isScheduling, isSOS)
        .then(builtAppointmentObject =>{
            let specialists = builtAppointmentObject.availableSpecialists 
            let toDateTime = DateTimeHelper.addTo(fromDateTime, 180, 'minutes')
            if (payload.specialistUuid) {
                specialists = _.filter(specialists, {uuid:payload.specialistUuid})
            }
            
            let availability = AppointmentHelper.getSpecialistAvailability(builtAppointmentObject, specialists,  
                                    fromDateTime, toDateTime, DEFAULT_WAITING_TIME_TO_START_SOS , false, true)

            ////Sort filter specialists by location                        
            availability = AppointmentHelper.filterUsersByLocation(availability, {lat, lng}, SOS_MAX_RADIUS, true)

            builtAppointmentObject.availableSpecialists = availability 
            builtAppointmentObject.location = {lat, lng}                       

           return reply(builtAppointmentObject)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))          
        })

    }


    postAppointmentRating(request,  reply) {
        const {rating, comments, userUuid} = request.payload

        let requestUser = request.auth.credentials

        // if (requestUser.uuid !== userUuid) {
        //    return reply(Boom.notFound('Only authenticated users can make reviews'))
        // }

        AppointmentHelper.postAppointmentRating(request.params.uuid, rating, comments, userUuid)
        .then(appointment =>{
            return reply(appointment)
        })
        .catch(err =>{
            return reply(err)
        })
    }


}


export default new AppointmentsController()

