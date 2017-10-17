import _ from 'lodash'
var env = process.env.NODE_ENV || 'development';
var path = require('path');

var constants = {
  PORT: 8001,
  HOST: '0.0.0.0',
  MONGO_URL: "mongodb://localhost/laFemme",
  HOST_URL: "http://studio.lafemme.com.co",
  secret: '9653224881',
  NODE_ENV: env,
  GCM_NOTIFICATION_TOKEN: 'AAAABzGI_IQ:APA91bEP3uW5eFUKWt2jxX3PLF-mqB8R2Z7c30cW4WdyuTFlJwqFITSfZAl6ruwedHASU4g0fdthcVQ-pgKFwIJZ86Z2sODbXlpewqDNZn3QKboXo8sT_4XhN4OG-70vBNJYlT2rKHGZ',
  IOS_NOTIFICATION_BUNDLE_ID: 'com.femme.lafemme',
  IOS_CERT_PATH: path.resolve(__dirname) +'/certs/lafemme.p12'
};

var customizations = {};
console.log('Using NODE ENV:', env)
switch (env) {
  case 'development':
    customizations = {
      POSTGRES: {
        "username": "lafemme",
        "password": "tK:;}yW7~KsWwTkj",
        "database": "LaFemme",
        "host": "127.0.0.1",
        "dialect": "postgres"
      }
    };
    break;
  case 'prod_lafemme':
    customizations = {
      POSTGRES: {
        "username": "lafemme",
        "password": "tK:;}yW7~KsWwTkj",
        "database": "LaFemmeProduction",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "logging": false
      }
    };
    break;

  case 'local':
    customizations = {
      POSTGRES: {
        "username": "lafemme",
        "password": "lafemme",
        "database": "laFemme",
        "host": "127.0.0.1",
        "dialect": "postgres",
        logging: false,
        HOST_URL: "http://studio.lafemme.com.co"
      }
    };
    break;

  default:
    customizations = {
      POSTGRES: {
        "username": "oscarg798",
        "password": "oscardx1517",
        "database": "lafemme",
        "host": "127.0.0.1",
        "dialect": "postgres"
      }
    }
    break;

}

var config = _.assign(constants, customizations)


module.exports = config;
