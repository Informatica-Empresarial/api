const mongoose = require('mongoose')
const PasswordReset = mongoose.model('PasswordReset')

import Boom from 'boom'
import _ from 'lodash'
import co from 'co'
import Uuid from 'uuid'

import nError from '../lib/nice_errors'
import UsersMailer from '../mailers/users_mailer'
import userLib from '../lib/userHelper'
import models from '../models'
import log from '../lib/logsHelper'
import constants from '../lib/constants'

class UsersController {
  get (request, reply) {
    co(function *() {

    let where = {
        accountUuid: request.auth.credentials.accountId,
        uuid: request.params.uuid
      }
 
      let user = yield models.user.findOne({
        where: where,
        include: models.user_devices
      })

      if (!user) {
        return reply(Boom.notFound('No such user'))
      }

      reply(user.toJSON())
    })
  }

  index (request, reply) {
    co(function *() {

      let where = {
          accountUuid: request.auth.credentials.accountId
        }
  
      let {ROLE_SYSTEM_NAMES}   = constants.all()
      let contains = [] 

      if (request.query.specialist) {
        contains.push(ROLE_SYSTEM_NAMES.SERVICE_SPECIALIST)
      }

      if (request.query.customers) {
          contains.push(ROLE_SYSTEM_NAMES.CUSTOMER_USER)
      }

      if (request.query.SOS) {
          _.assign(where, {SOS:true})
      }

      if (contains.length > 0) {
        _.assign(where, {
          roles:{$contains:contains}
        })
      }

      let users = yield models.user.findAll({
        where: where,
        include: models.user_devices
      })

      let results = users.map(user => user.toJSON())
      reply(results)
    })
      .catch(error => {
        console.log(error)
        reply(Boom.badRequest('Failed to load users'))
      })
  }

  post (request, reply) {

    var user = models.user.build({
      uuid:          Uuid.v4(),
      email:         request.payload.email,
      password:      request.payload.password,
      accountUuid:   request.payload.accountId,
      roles:         request.payload.roles,
      groups:        request.payload.groups,
      workerAccount: request.payload.workerAccount || false,
      firstName:     request.payload.firstName,
      lastName:      request.payload.lastName,
      phoneNumber:   request.payload.phoneNumber,
      supervisors:   request.payload.supervisors,
      city:          request.payload.city,
      address:       request.payload.address,
      DNI:           request.payload.DNI,
      avatar:        request.payload.avatar,
      description:   request.payload.description,
      availability:  request.payload.availability
    })

    user.save()
      .then(result => {
        log.userCreated(user.accountUuid, user.uuid, user.email)

        return user.getAccount()
          .then(account => {
            return account.updateSystemGroup()
          })
          .then(() => {
            return reply(result.toJSON())
          })
      })
      .catch(err => {
        console.error(err)
        return reply(Boom.badRequest('Failed to add user.'))
      })
  }

  register (request, reply) {

    var ROLES = constants.all()

    var user = models.user.build({
      uuid:          Uuid.v4(),
      email:         request.payload.email,
      password:      request.payload.password,
      accountUuid:   request.payload.accountId,
      roles:         [ROLES.ROLE_SYSTEM_NAMES.CUSTOMER_USER],
      firstName:     request.payload.firstName,
      lastName:      request.payload.lastName,
      address:       request.payload.address,
      phoneNumber:   request.payload.phoneNumber,
      city:          request.payload.city,
      DNI:           request.payload.DNI         
    })


    if (request.payload.workerAccount == null) {
      user.workerAccount = false
    }

    user.save()
      .then(result => {
        log.userCreated(user.accountUuid, user.uuid, user.email)

        return user.getAccount()
          .then(account => {
            return account.updateSystemGroup()
          })
          .then(() => {
            var response = result.toJSON()
            response.token = user.token
            return reply(response)
          })
      })
      .catch(err => {
        console.error(err)
        return reply(Boom.badRequest('Failed to add user.'))
      })
  }


  update(request, reply) {
    models.user.findOne({
        where: {
          uuid: request.payload.uuid
        }
      })
      .then(function(user) {
        if (user === null) {
          return reply(Boom.notFound('Could not find a user with that uuid.'))
        }
        if (request.auth.credentials.admin === false && request.auth.credentials.accountId != user.accountUuid) {
          return reply(Boom.notFound('You may only modify users to your own account.'))
        }

        if (request.payload.email) {
          user.email = request.payload.email;
        }

        if (request.payload.password) {
          user.password = request.payload.password;
        }

        if (request.payload.roles) {
          user.roles = request.payload.roles;
        }

        if (request.payload.groups) {
          user.groups = request.payload.groups;
        }

        if (request.payload.workerAccount) {
          user.workerAccount = request.payload.workerAccount;
        }

        if (request.payload.firstName) {
          user.firstName = request.payload.firstName;
        }

        if (request.payload.lastName) {
          user.lastName = request.payload.lastName;
        }

        if (request.payload.phoneNumber) {
          user.phoneNumber = request.payload.phoneNumber;
        }

        if (request.payload.address) {
          user.address = request.payload.address;
        }

        if (request.payload.DNI) {
          user.DNI = request.payload.DNI;
        }


        if (request.payload.city) {
          user.city = request.payload.city;
        }

        if (request.payload.avatar) {
          user.avatar = request.payload.avatar;
        }

        if (request.payload.description) {
          user.description = request.payload.description;
        }

        if (typeof request.payload.availability == 'object') {
          user.availability = request.payload.availability;
        }

        if(typeof request.payload.active != 'undefined') {
          user.active = request.payload.active;
        }

        user.supervisors = request.payload.supervisors

        user.save().then(function() {
          log.updateObject(request.auth.credentials.accountId,request.auth.credentials.uuid,null,request.auth.credentials.email,"User");
          return reply(user.toJSON());
        });
      });
  }

  updateLastKnownLocation(request, reply){
     models.user.findOne({
        where: {
          uuid: request.params.uuid
        }
      })
      .then(user=>{
        if (user === null) {
          return reply(Boom.notFound('Could not find a user with that uuid.'))
        }
        if (request.auth.credentials.admin === false && request.auth.credentials.accountId != user.accountUuid) {
          return reply(Boom.notFound('You may only modify users to your own account.'))
        }
        user.lastKnownLocation = request.payload.lastKnownLocation
        return user.save()
      })   
      .then(reply)
      .catch(err =>{
        return reply(err)
      })
  }


  toggleSOS(request, reply){
     var ROLES = constants.all()
     
     models.user.findOne({
        where: {
          uuid: request.params.uuid
        }
      })
      .then(user=>{

        let requestUser = request.auth.credentials

        if (user === null) {
           return reply(Boom.notFound('Could not find a user with that uuid.'))
        }
        if (request.auth.credentials.admin === false && request.auth.credentials.accountId != user.accountUuid) {
          return reply(Boom.badRequest('You may only modify users to your own account.'))
        }

        if (!_.includes(user.roles, ROLES.ROLE_SYSTEM_NAMES['SERVICE_SPECIALIST'])) {
           return reply(Boom.badRequest('Only users with specialist role can turn on SOS mode'))
        }

        if (requestUser.uuid !== user.uuid && request.auth.credentials.admin !== true) {
           return reply(Boom.badRequest('The token provided is not a valid for the SOS user,  SOS mode can only be turned on by the user or an admin'))
        }

        if (request.payload.lastKnownLocation) {
          user.lastKnownLocation = request.payload.lastKnownLocation
        }

        user.SOS = !user.SOS
        user.save()
        .then(user=>{
           return reply(user)
        })
      })   
      .catch(err =>{
        return reply(err)
      })
  }

  SOSoff(request, reply){
     var ROLES = constants.all()
     
     models.user.findOne({
        where: {
          uuid: request.params.uuid
        }
      })
      .then(user=>{

        let requestUser = request.auth.credentials

        if (user === null) {
           return reply(Boom.notFound('Could not find a user with that uuid.'))
        }
        if (request.auth.credentials.admin === false && request.auth.credentials.accountId != user.accountUuid) {
          return reply(Boom.badRequest('You may only modify users to your own account.'))
        }

        if (!_.includes(user.roles, ROLES.ROLE_SYSTEM_NAMES['SERVICE_SPECIALIST'])) {
           return reply(Boom.badRequest('Only users with specialist role can turn on SOS mode'))
        }

        if (requestUser.uuid !== user.uuid && request.auth.credentials.admin !== true) {
           return reply(Boom.badRequest('The token provided is not a valid for the SOS user,  SOS mode can only be turned on by the user or an admin'))
        }

        if (request.payload.lastKnownLocation) {
          user.lastKnownLocation = request.payload.lastKnownLocation
        }

        user.SOS = false
        user.save()
        .then(user=>{
           return reply(user)
        })
      })   
      .catch(err =>{
        return reply(err)
      })
  }

  SOSon(request, reply){
     var ROLES = constants.all()
     
     models.user.findOne({
        where: {
          uuid: request.params.uuid
        }
      })
      .then(user=>{

        let requestUser = request.auth.credentials

        if (user === null) {
           return reply(Boom.notFound('Could not find a user with that uuid.'))
        }
        if (request.auth.credentials.admin === false && request.auth.credentials.accountId != user.accountUuid) {
          return reply(Boom.badRequest('You may only modify users to your own account.'))
        }

        if (!_.includes(user.roles, ROLES.ROLE_SYSTEM_NAMES['SERVICE_SPECIALIST'])) {
           return reply(Boom.badRequest('Only users with specialist role can turn on SOS mode'))
        }

        if (requestUser.uuid !== user.uuid && request.auth.credentials.admin !== true) {
           return reply(Boom.badRequest('The token provided is not a valid for the SOS user,  SOS mode can only be turned on by the user or an admin'))
        }

        if (request.payload.lastKnownLocation) {
          user.lastKnownLocation = request.payload.lastKnownLocation
        }

        user.SOS = true
        user.save()
        .then(user=>{
           return reply(user)
        })
      })   
      .catch(err =>{
        return reply(err)
      })
  }

  destroy(request, reply) {
    models.user.findOne({
        where: {
          uuid: request.params.uuid
        }
      })
      .then(user => {
        if (user === null) {
          return reply(nError("User not found", {}, 404));
        }

        if (request.auth.credentials.admin === false && request.auth.credentials.accountId !== user.accountUuid) {
          return reply(Boom.badRequest('You may only delete users in your own account.'))
        }

        if (!userLib.checkPermision("ModifyAdminUsers", request) && !userLib.checkPermision("ModifyNonAdminUsers", request)) {
          return reply(Boom.unauthorized("You don't have the required permision."))
        }

        user.destroy().then(function() {
          log.deleteObject(request.auth.credentials.accountId,request.auth.credentials.uuid,null,request.auth.credentials.email,"User");
          return reply("User removed.");
        });
      });
  }

  resetPasswordRequest (request, reply) {
    models.user.findOne({
      where: {
        email: request.payload.email
      }
    })
      .then(result => {
        if (!result) {
          return reply(Boom.badRequest('We could not find your email.'))
        }

        PasswordReset.find({
          email: request.payload.email
        })
          .remove()
          .then(() => {
            var newResetToken = PasswordReset({
              email: request.payload.email
            })

            return newResetToken.save()
          })
          .then(resetToken => {
            return UsersMailer.sendRequestPasswordEmail(resetToken)
          })
          .then(result => {
            reply('Reset Password Email Sent')
          })
          .catch(err => {
            console.log(err)
            reply(Boom.badRequest(err.message))
          })
      })
  }

  resetPassword (request, reply) {
    PasswordReset.findOne({
      resetToken: request.payload.token
    })
      
      .then(token => {
        if (!token) {
          throw new Error('Invalid password reset token')
        }

        return models.user.findOne({
          where: {email: token.email}
        })
          .then(user => {
            if (!user) {
              throw new Error('Could not find the user')
            }

            if (request.payload.newPassword !== request.payload.newPasswordConfirm) {
              throw new Error("Password doesn't match the confirmation")
            }

            user.password = request.payload.newPassword

            return user.save()
              .then(user => {
                return token.remove()
              })
              .then(() => {
                return reply('New password set successfully.')
              })
              .catch(error => {
                throw new Error(error)
              })
          })
      })
      .catch(err => {
        console.error(err)
        return reply(Boom.badRequest(err || 'Invalid password reset token'))
      })
  }
}

export default new UsersController()
