'use strict';

var Joi = require('joi');
var constantsController = require('../../controllers/constantController');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/constants',
      config: {
        tags: ['api'],
        handler: constantsController.index,
        auth: {
          mode: 'required',
          strategy: 'token'
        }
      }
    },
     {
      method: 'GET',
      path: '/constants/mobile',
      config: {
        tags: ['api'],
        handler: constantsController.index,
        auth: {
          mode: 'required',
          strategy: 'token'
        }
      }
    },
     {
      method: 'GET',
      path: '/constants/studio',
      config: {
        tags: ['api'],
        handler: constantsController.index,
        auth: {
          mode: 'required',
          strategy: 'token'
        }
      }
    },
  ];
}();
