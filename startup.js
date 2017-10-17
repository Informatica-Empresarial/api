require('babel-polyfill')
require('babel-register')
var mongo_url = process.env.MONGO_URL || 'mongodb://localhost/lafemme'
var server = null;

if (process.env.NODE_ENV == 'test') {
  mongo_url = 'mongodb://localhost/lafemme-test'
}

let mongoose = require('./mongoose.js')
mongoose.init(mongo_url, function() {
  console.log('connected to Mongo DB');
  server = require('./config/server');
});



exports.stop = function(cb) {
  if (server) {
    console.log('stop!!!!!!');
    server.stop({
      timeout: 100
    }, cb);
  }
};