import _ from 'lodash'
import models from '../models'
import Authenticate from '../lib/commands/authenticate'
import Boom from 'boom'
import log from '../lib/logsHelper'
import constants from '../lib/constants'
import userLib from '../lib/userHelper'

const mongoose = require('mongoose')

class SessionsController {
  post(request, reply) {
    // if (request.auth.isAuthenticated) {
    //   return reply('Already logged in')
    // }

    var email = request.payload.email.toLowerCase();

    models.user.findOne({
      where: {
        email: email
      }
    })
      .then(user => {
        if (!user) {
          throw new Error('Invalid email and/or password')
        }

        return user.authenticate(request.payload.password)
          .then(isMatch => {
            if (!isMatch) {
              throw new Error('Invalid email and/or password')
            }
              models.account.findOne({
                where: {
                  uuid: user.accountUuid
                }
              })
                .then(account => {
                    userLib.buildUser(user)
                    .then(result => {
                            log.userLoggedIn(result.accountId, result.uuid, result.email)
                            result.constants = constants.all()
                            return reply(result)
                    })
                })
          })
      })
      .catch(error => {
        console.error(error)
        return reply(Boom.badRequest(error))
      })
  }

  validator(request, reply) {
    Authenticate(request.payload.token)
      .then(user => {
        return reply(user)
      })
      .catch(err => {
        console.error(err)
        return reply(Boom.unauthorized('Invalid token'))
      })
  }

  fblogin(request, reply) {
    console.log('using payload for fblogin ', JSON.stringify(request.payload))
    models.user.findOne({
      where: {
        email: ''
      }
    })
    .then(user =>{
      userLib.buildUser(user).then(result => {
              result.constants = constants.all()
              return reply(result)
      })      
    })
    .catch(err =>{
      return reply(Boom.unauthorized('Unable to find the requested user'))
    })
  }
}

export default new SessionsController()
