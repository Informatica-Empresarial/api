var async = require('async')
var db = require("../models");

module.exports.testToken = ''

module.exports = function () {

  return new Promise(function (resolve, reject) {
    console.log("Starting the seed functions.")

    //if you want to add a new document section, add it to array below.
    async.series([
      require('./account'),
      require('./users'),
    ], function () {

      db.user.findOne({where:{
        email: 'admin@admin.com'
      }}).then(function (user) {
        if (user) {
          module.exports.testToken = user.token
        }
        console.log("All seed functions are done.")
        resolve();
      })
    })

  });

}
