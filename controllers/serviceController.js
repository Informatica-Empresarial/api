import ServiceHelper from '../lib/serviceHelper'
import Boom from 'boom'
import _ from 'lodash'

class ServiceController { 

    index(request, reply) {
        const accountId = request.auth.credentials.accountId
        const payload = _.assign(request.query, request.payload, request.params)
        
        ServiceHelper.getServices(accountId, payload)
        .then(services =>{
           return reply(services)
        })
        .catch( err => {
           console.log(err)
           return reply(Boom.badRequest(err))
        }) 

    }

    create(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        const accountId = request.auth.credentials.accountId

        let {alias, name, description, items, tags, imageUrl, instruction, currency,
             price, minutes_duration, enabled, serviceAvailabilities, maxCount, groupUuids} = payload

        ServiceHelper.create(accountId, alias, name, serviceAvailabilities , description, items, tags, imageUrl, 
        instruction, currency, price, minutes_duration, enabled, maxCount, groupUuids, request.auth.credentials)
        .then(service =>{
            return reply(service)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })

    }

    getServiceByUuid(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        ServiceHelper.getServiceByUuid(payload.uuid)
        .then(service =>{
            return reply(service)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }

    update(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        const accountId = request.auth.credentials.accountId
        let {uuid, alias, name, order, description, items, tags, imageUrl, instruction, 
            currency, price, minutes_duration, enabled, serviceAvailabilities, maxCount, groupUuids} = payload

        items = (items) ? items : []    

        ServiceHelper.updateByUuid(uuid, alias, name, order, serviceAvailabilities ,description, 
        items, tags, imageUrl, instruction, currency, price, minutes_duration, enabled, maxCount, groupUuids ,request.auth.credentials)
        .then(service =>{
            return reply(service)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })          
    }

    delete(request, reply) {
        const payload = _.assign(request.query, request.payload, request.params)
        ServiceHelper.deleteByUuid(payload.uuid)
        .then(service =>{
            return reply(service)
        })
        .catch(err =>{
            console.log(err)
            return reply(Boom.badRequest(err))
        })        
    }


}


export default new ServiceController()

