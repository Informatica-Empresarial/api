const mongoose = {
    init: init
};

module.exports = mongoose;

function init(mongo_url, cb) {
    var mongoose = require("mongoose");
    require("./mongo_models");

    mongoose.connect(mongo_url, function () {
        if (cb) {
            cb();
        }
    });
};