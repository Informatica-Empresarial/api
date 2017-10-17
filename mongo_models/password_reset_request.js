var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Uuid = require('uuid');

var passwordResetRequest = new Schema({
  email: {
    type:     String,
    required: true,
    unique:   true
  },

  resetToken: {
    type:     String,
    unique:   true
  },

  createdAt: Date
});

passwordResetRequest.pre('save', function(next) {
  var now = new Date();

  if (this.isNew) {
    this.createdAt = now;
    this.resetToken = Uuid.v4();
  }

  next();
})

mongoose.model('PasswordReset', passwordResetRequest);
