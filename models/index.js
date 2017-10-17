'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var dir = require('node-dir');

var config = require('../config/config.js');
var db = {};

db.init = function() {
  return new Promise(function(resolve, reject) {

    var sequelize = new Sequelize(config.POSTGRES.database, config.POSTGRES.username, config.POSTGRES.password, config.POSTGRES);

    dir.files(__dirname, function(err, files) {
      if (err) {
        reject(err);
      }
      files.forEach(function(file) {
        if (file.slice(-3) !== '.js' || file.slice(-8) === "index.js") return;

        if (file.includes("form")) return;

        try {
          var model = sequelize['import'](file);
          db[model.name] = model;
        } catch (err) {
          console.error("Failed on " + file);
          throw err;
        }

      });


      Object.keys(db).forEach(function(modelName) {
        try {
          if (db[modelName].associate) {
            db[modelName].associate(db);
          }
        } catch (err) {
          console.error("Failed on " + modelName);
          throw err;
        }

      });

      db.sequelize = sequelize;
      db.Sequelize = Sequelize;

      var options = { force: false };
      if (process.env.NODE_ENV === 'test') {
        options.force = true
      }
      db.sequelize.sync(options).then(() => {
          resolve(db);
        })
        .catch(function(err) {
          console.error("Error syncing sequelize: " + err);
          process.exit();
        });
    });
  });
};

module.exports = db;
