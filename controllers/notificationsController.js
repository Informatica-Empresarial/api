import Boom      from 'boom'
import _         from 'lodash'
import DeviceHelper from '../lib/deviceHelper'
import NotificationHelper from '../lib/notificationHelper'
import AppointmentHelper from '../lib/appointmentHelper'

class NotificationsController {

  sendNotifications (request, reply) {
    const payload = _.assign(request.query, request.payload, request.params)
    let {appointmentUuid, userUuids, IOS, Android, titleAux, messageAux, additionalPayload} = payload
    let {accountId} = request.auth.credentials
    NotificationHelper.sendNotificationPack(appointmentUuid, userUuids, IOS, Android, titleAux, messageAux, additionalPayload, accountId)
    .then(response=>{
      return reply(response)
    })
    .catch(err =>{
      console.log(err)
      return reply(err)
    })
  }

}

export default new NotificationsController()
