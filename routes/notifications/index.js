import Joi from 'joi'
import DevicesController from '../../controllers/deviceController'
import NotificationsController from '../../controllers/notificationsController'

let auth = {
  mode: 'required',
  strategy: 'token'
}

export default [
  {
    method: 'GET',
    path: '/devices',
    handler: DevicesController.index,
    config: {
      tags: ['api'],
      validate: {
        query:{
          userUuid: Joi.string().optional()
        }
      },
      auth
    }
  },
  {
    method: 'POST',
    path: '/devices/register',
    handler: DevicesController.post,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          userUuid:            Joi.string().required(),
          platform:            Joi.string().valid("IOS", "Android").required(),
          deviceUuid:          Joi.string().required(),
          appIdentifier:       Joi.string().required(),
          deviceData:          Joi.object().optional()
        }
      },
      auth
    }
  },
  {
    method: 'POST',
    path: '/notifications/send-notification',
    handler: NotificationsController.sendNotifications,
    config: {
      tags: ['api'],
      validate: {
        payload:{
          IOS:                Joi.boolean().optional(),
          Android:            Joi.boolean().optional(),
          titleAux:           Joi.string().required(),
          messageAux:         Joi.string().required(),
          userUuids:          Joi.array().required(),
          appointmentUuid:    Joi.string().optional(),
          additionalPayload:  Joi.object().optional()
        }
      },
      auth
    }
  },
  {
    method: "POST",
    path: "/devices/delete",
    handler: DevicesController.delete,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          userUuid:            Joi.string().required(),
          deviceUuid:          Joi.string().required()
        }
      },
      auth
    }
  }
]
