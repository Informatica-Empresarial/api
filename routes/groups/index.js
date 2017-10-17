import Joi from 'joi'
import GroupsController from '../../controllers/groupsController'

let auth = {
  mode: 'required',
  strategy: 'token'
}

export default [
  {
    method: 'GET',
    path: "/groups/{uuid}",
    handler: GroupsController.get,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        },
      },
      auth
    }
  },

  {
    method: 'GET',
    path: "/groups",
    handler: GroupsController.index,
    config: {
      tags: ['api'],
      auth
    }
  },

  {
    method: "DELETE",
    path: "/groups/{uuid}",
    handler: GroupsController.destroy,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        }
      },
      auth: {
        mode: 'required',
        strategy: 'token'
      },
    }
  },

  {
    method: 'POST',
    path: '/groups',
    handler: GroupsController.post,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          uuid:                Joi.string().optional(),
          name:                Joi.string().required(),
          description:         Joi.string().optional().allow(''),
          activeDirectoryName: Joi.string().optional().allow(''),
          userUuids:           Joi.array().items(Joi.string()).optional(),
        }
      },
      auth
    }
  },

  {
    method: "PUT",
    path: "/groups/{uuid}",
    handler: GroupsController.put,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        },
        payload: {
          name:                Joi.string().optional(),
          description:         Joi.string().optional().allow(''),
          activeDirectoryName: Joi.string().optional().allow(''),
          userUuids:           Joi.array().items(Joi.string()).optional(),
        }
      },
      auth
    }
  }
]
