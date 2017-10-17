import Joi from 'joi'
import UsersController from '../../controllers/userController'

export default [
  {
    method: 'POST',
    path: '/users',
    handler: UsersController.post,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          email:         Joi.string().required(),
          password:      Joi.string().required(),
          accountId:     Joi.string().required(),
          roles:         Joi.array().items(Joi.string()).optional(),
          groups:        Joi.array().items(Joi.string()).optional(),
          supervisors:   Joi.array().items(Joi.string()).optional(),
          workerAccount: Joi.boolean().optional(),
          firstName:     Joi.string().optional(),
          phoneNumber:   Joi.string().optional().allow(''),
          lastName:      Joi.string().optional(),
          city:          Joi.string().required(),
          address:       Joi.string().optional(),
          DNI:           Joi.string().optional().allow(''),
          avatar:        Joi.string().optional().allow(''),
          description:   Joi.string().optional(),
          availability:  Joi.object().optional(),
          active:        Joi.boolean().optional() 
        }
      },
      auth: {
        mode: 'required',
        strategy: 'token'
      }
    }
  },
  {
    method: 'POST',
    path: '/users/register',
    handler: UsersController.register,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          email:         Joi.string().required(),
          password:      Joi.string().required(),
          accountId:     Joi.string().required(),
          firstName:     Joi.string().required(),
          lastName:      Joi.string().required(),
          phoneNumber:   Joi.string().required(),
          city:          Joi.string().required(),
          address:       Joi.string().optional(),
          DNI:           Joi.string().optional()
        }
      },
    }
  }
];
