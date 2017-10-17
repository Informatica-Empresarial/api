'use strict';

var Joi = require("joi");
var UsersController = require('../../controllers/userController');

module.exports = [
  {
    method: "POST",
    path: "/reset-password",
    handler: UsersController.resetPassword,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          token:              Joi.string().required(),
          newPassword:        Joi.string().required(),
          newPasswordConfirm: Joi.string().required(),
        }
      },
      auth: {
        mode: 'optional',
        strategy: 'token'
      }
    }
  },

  {
    method: "POST",
    path: "/request-password-reset",
    handler: UsersController.resetPasswordRequest,
    config: {
      tags: ['api'],
      auth: {
        mode: 'try',
        strategy: 'token'
      },
      validate: {
        payload: {
          email: Joi.string().required(),
        }
      },
    }

  }
]
