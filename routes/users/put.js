import Joi from 'joi'
import UsersController from '../../controllers/userController'

module.exports = [
  {
    method: "PUT",
    path: "/users/{uuid?}",
    handler: UsersController.update,
    config: {
      tags: ['api'],
      auth: {
        mode: 'required',
        strategy: 'token'
      },
      validate: {
        payload: {
          uuid:          Joi.string().required(),
          email:         Joi.string().optional(),
          password:      Joi.string().optional(),
          roles:         Joi.array().items(Joi.string()).optional(),
          groups:        Joi.array().items(Joi.string()).optional(),
          phoneNumber:   Joi.string().optional().allow('').allow(null),
          workerAccount: Joi.boolean().optional(),
          firstName:     Joi.string().optional(),
          lastName:      Joi.string().optional(),
          address:        Joi.string().optional().allow(''),
          supervisors:   Joi.array().items(Joi.string()).optional(),
          city:          Joi.string().optional(),
          DNI:           Joi.string().optional().allow(''),
          avatar:        Joi.string().optional().allow(''),
          description:   Joi.string().optional(),
          availability:  Joi.object().optional().allow(null),
          active:        Joi.boolean().optional(),        
        }
      },
    }
  },
  {
    method: "PUT",
    path: "/users/{uuid}/lastKnownLocation",
    handler: UsersController.updateLastKnownLocation,
    config: {
        tags: ['api'],
        auth: {
          mode: 'required',
          strategy: 'token'
        },
        validate: {
          params: {
            uuid: Joi.string().required()
          },
          payload: {
            lastKnownLocation:  Joi.object({
              lat : Joi.number().required(),
              lng : Joi.number().required()
            }).optional()
        }
      }
    }
  },
  {
    method: "PUT",
    path: "/users/{uuid}/toggleSOS",
    handler: UsersController.toggleSOS,
    config: {
        tags: ['api'],
        auth: {
          mode: 'required',
          strategy: 'token'
        },
        validate: {
          params: {
            uuid: Joi.string().required()
          },
          payload: {
            lastKnownLocation:  Joi.object({
              lat : Joi.number().required(),
              lng : Joi.number().required()
            }).optional()
        }
      }
    }
  },
  {
    method: "PUT",
    path: "/users/{uuid}/SOS/off",
    handler: UsersController.SOSoff,
    config: {
        tags: ['api'],
        auth: {
          mode: 'required',
          strategy: 'token'
        },
        validate: {
          params: {
            uuid: Joi.string().required()
          },
          payload: {
            lastKnownLocation:  Joi.object({
              lat : Joi.number().required(),
              lng : Joi.number().required()
            }).optional()
        }
      }
    }
  },
  {
    method: "PUT",
    path: "/users/{uuid}/SOS/on",
    handler: UsersController.SOSon,
    config: {
        tags: ['api'],
        auth: {
          mode: 'required',
          strategy: 'token'
        },
        validate: {
          params: {
            uuid: Joi.string().required()
          },
          payload: {
            lastKnownLocation:  Joi.object({
              lat : Joi.number().required(),
              lng : Joi.number().required()
            }).optional()
        }
      }
    }
  }
]
