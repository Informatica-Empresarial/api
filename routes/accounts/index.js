import Joi from 'joi';
import AccountsController from '../../controllers/accountController';

export default [{
    method: 'GET',
    path: '/accounts',
    handler: AccountsController.get,
    config: {
      tags: ['api'],
      auth: {
        mode: 'required',
        strategy: 'token'
      }
    }
  },

  {
    method: 'GET',
    path: '/accounts/{accountUuid}',
    handler: AccountsController.get,
    config: {
      tags: ['api'],
      auth: {
        mode: 'required',
        strategy: 'token'
      }
    }
  },

  {
    method: 'PUT',
    path: '/accounts/{id}',
    handler: AccountsController.update,
    config: {
      tags: ['api'],
      validate: {
        params: {
          id: Joi.string().required(),
        },
        payload: {
          permissions: Joi.array().optional(),
          groups: Joi.array().optional(),
          checkedOutSolutionUuid: Joi.string().allow(null, '').optional(),
          ADRolesMap: Joi.array().optional(),
          fileServerHostName: Joi.string().optional(),
          publicKey: Joi.string().optional(),
          remoteAuthUrl: Joi.string().optional(),
          TOS: Joi.string().optional(),
          descriptions: Joi.object().optional(),
          images: Joi.object().optional(),
        }
      },
      auth: {
        mode: 'required',
        strategy: 'token'
      }
    }
  }
]