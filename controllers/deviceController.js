import Boom         from 'boom'
import DeviceHelper from '../lib/deviceHelper'
import _         from 'lodash'


class DevicesController {
  post (request, reply) {
    const payload = _.assign(request.query, request.payload, request.params)
    const {userUuid, deviceUuid, platform, appIdentifier, deviceData} = payload
    const user = request.auth.credentials
    const accountId = request.auth.credentials.accountId

    DeviceHelper.registerDevice(user.uuid, deviceUuid, platform, appIdentifier, accountId , deviceData, user.email)
    .then( device => {
      return reply(device)
    })
    .catch( err =>{
      console.log('Failed to register device: Device already registered')
      return reply('Failed to register device: Device already registered')
    })
  }

  delete (request, reply) {
    const payload = _.assign(request.query, request.payload, request.params)
    const {userUuid, deviceUuid} = payload
    const user = request.auth.credentials
    DeviceHelper.deleteDevice(userUuid, deviceUuid, user.accountId , user.email)
    .then(response => {
      return reply(response)
    })
    .catch( err => {
       return reply(Boom.badRequest(err))
    })
  }

  index (request, reply) {
    const accountId = request.auth.credentials.accountId
    const payload = _.assign(request.query, request.payload, request.params)
    const {userUuid} = payload
    const onlyDevices = true
    DeviceHelper.getDevices(userUuid, accountId)
    .then( devices => {
      reply(devices)
    })
    .catch( err => {
      reply(Boom.badRequest(err))
    })
  }


}

export default new DevicesController()
