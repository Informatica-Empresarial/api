import Joi from 'joi'
import SessionsController from '../../controllers/sessionController'

const auth = {
  mode: 'try',
  strategy: 'token'
}

export default [
  {
    method: 'POST',
    path: '/sessions',
    config: {
      tags: ['api'],
      notes: [],
      validate: {
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required()
        }
      },
      handler: SessionsController.post,
      auth
    }
  },

  {
    method: 'POST',
    path: '/sessions/validate',
    config: {
      tags: ['api'],
      validate: {
        payload: {
          token: Joi.string().required()
        }
      },
      handler: SessionsController.validator,
      auth
    }
  },

  {
    method: 'POST',
    path: '/sessions/facebook',
    config: {
      tags: ['api'],
      validate: {
        payload: {
          token: Joi.string().required()
        }
      },
      handler: SessionsController.fblogin,
      auth
    }
  }

]
