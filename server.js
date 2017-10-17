import Hapi from 'hapi'
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const AuthBearer = require('hapi-auth-bearer-token');
import moment from 'moment'
import uuid from 'uuid'

import Authenticate from './lib/commands/authenticate'

import {
  PORT,
  API_BASE
} from './config/config.js'

import db from './models'
import sequelize from 'sequelize'
import seed from './seed'


const server = new Hapi.Server()
server.connection({
  host: '0.0.0.0',
  port: PORT,
  routes: {
    cors: true
  }
})

server.register([Inert, Vision, AuthBearer,
    {
      register: HapiSwagger,
      options: {
        info: {
          title: "LaFemme API",
          version: moment(Date.now()).format('HH:mm:ss YYYY-MM-DD'), //TODO: Fix api version and base path.
        },
        securityDefinitions: {
          'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'x-keyPrefix': 'Bearer '
          }
        },
        security: [{
          'Bearer': []
        }],
        sortEndpoints: 'path',
        sortTags: 'name'
      }
    },
    {
      register: require('good'),
      options: {
        ops: {
          interval: 1000
        },
        reporters: {
          myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
              log: '*',
              response: '*',
              error: '*'
            }]
          }, {
            module: 'good-console'
          }, 'stdout']
        }
      }
    }
  ],
  function (err) {
    if (err) {
      console.error(err);
      return;
    }

    server.auth.strategy('token', 'bearer-access-token', {
      allowQueryToken: false,
      allowMultipleHeaders: false,
      accessTokenName: 'token',

      validateFunc: function (token, callback) {        
        Authenticate(token).then(function (user) {
          callback(null, true, user)
        }, function (errorMessage) {
          callback(null, false, {
            message: errorMessage,
            token: token
          })
        })
      }
    });

    db.init()
      .then(() => {
        return seed();
      })
      .then(() => {
        server.route(require('./routes'));
        server.start((err) => {
          if (err) {
            throw err;
          }
          console.log('Hapi server started ' + server.info.uri);
          require('./seed/psql_dataset_test_data');
        });
      })
      .catch(error => {
        console.error(error)
      });
  });

export default server