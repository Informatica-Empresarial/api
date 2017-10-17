import Joi from 'joi'
import UsersController from '../../controllers/userController'

module.exports = [
  {
    method: 'GET',
    path: "/users/{uuid}",
    handler: UsersController.get,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().optional()
        },
      },
      auth: {
        mode: 'required',
        strategy: 'token'
      }
    }
  },

  {
    method: 'GET',
    path: '/users',
    handler: UsersController.index,
    config: {
      tags: ['api'],
      validate: {
        query:{
          specialist: Joi.boolean().optional(),
          SOS: Joi.boolean().optional(),
          customers: Joi.boolean().optional()
        }
      },
      auth: {
        mode: 'required',
        strategy: 'token'
      }
    }
  }
]
