import Joi from 'joi'
import UsersController from '../../controllers/userController'

module.exports = {
  method: "DELETE",
  path: "/users/{uuid?}",
  handler: UsersController.destroy,
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
};
