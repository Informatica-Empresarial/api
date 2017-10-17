import _ from 'lodash'
import NodeRSA from 'node-rsa'
import models from '../models'
import log from './logsHelper'

const constants = require('./constants').all()

function add(model, callback) {
  var user = models.user.build({
    uuid: model.uuid,
    firstName: model.firstName,
    lastName: model.lastName,
    email: model.email,
    password: model.password,
    accountUuid: model.accountUuid,
    workerAccount: model.workerAccount,
    groups: model.groups,
    roles: model.roles
  })

  user.save()
    .then(() => {
      log.createObject(model.accountId, model.uuid, null, user.email, 'User')
      callback(null, user)
    })
    .catch(err => {
      callback(err, null)
    })
}

function checkPermision(permision, request) {
  if (request.auth.credentials.permissions) {
    for (var i = 0; i < request.auth.credentials.permissions.length; i++) {
      if (request.auth.credentials.permissions[i] === permision) {
        return true
      }
    }
  }
  return false
}

function buildUser(user) {
  return models.account.findOne({
      where: {
        uuid: user.accountId
      }
    })
    .then(account => {
      if (!account) {
        account = {
          groups: [],
          fileServerHostName: 'http://localhost:8001'
        }
      }

      if (!account.fileServerHostName) {
        account.fileServerHostName = 'http://localhost:8001'
      }

      let permissions = []

      if (user.roles) {
        user.roles.forEach(function (userRole) {
          constants.ROLES.forEach(function (systemRole) {
            if (userRole === systemRole.systemName) {
              systemRole.permissions.forEach(function (p) {
                permissions.push(p)
              })
            }
          })
        })
      }

      return user.getGroups()
        .then(groups => {
          permissions = permissions.concat(_.map(groups, 'uuid'))

          return {
            uuid: user.uuid,
            email: user.email,
            firstName: user.firstName,
            address: user.address,
            city: user.city,
            avatar: user.avatar,
            admin: user.admin,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            token: user.token,
            SOS:   user.SOS,
            accountId: user.accountUuid,
            accountUuid: user.accountUuid,
            supervisors: user.supervisors,
            fileServerHostName: account.fileServerHostName,
            roles: user.roles,
            groups: groups,
            permissions: permissions,
          };


        })
    })
}

function getUsersByAccount(accountId) {
  return models.user.findAll({
    where: {
      accountUuid: accountId,
      workerAccount: false
    },
    include: models.user_devices
  })
}

function getUsersByEmail(accountId, emails) {

  if (!Array.isArray(emails)) {
    throw new Error('Getting users by email: emails param must be an array')
  }

  return models.user.findAll({
    where: {
      accountUuid: accountId,
      workerAccount: false,
      email: {
        $in: emails
      }
    }
  })
}

function buildADUser(remoteToken) {
  var deferred = Q.defer()


  models.account.findOne({
    where: {
      uuid: remoteToken.accountId
    }
  }).then(function (account) {
    if (account === undefined || account === null) {
      console.log('Failed to find account')
      return deferred.reject('failed to find account')
    }

    try {
      var key = new NodeRSA()

      key.importKey(account.publicKey, 'public')
      var data = key.decryptPublic(remoteToken.data, 'json')

      var roles = ["MobileEndUser"];
      var userGroups = [];
      var permissions = [];
      var ADGroups = [];

      if (data.adGroups) {
        data.adGroups.forEach(function (adGroup) {
          ADGroups.push(adGroup.cn)
        })
      }

      return account.getGroups()
        .then(groups => {

          if (groups) {
            groups.forEach(function (group) {
              ADGroups.forEach((adGroup) => {
                if (adGroup === group.activeDirectoryName) {
                  userGroups.push(group);
                  permissions.push(group.uuid);
                }
              });

              if (group.name === "Everyone") {
                userGroups.push(group);
                permissions.push(group.uuid);
              }

            });
          }

          if (account.ADRolesMap) {
            account.ADRolesMap.forEach(function (map) {
              if (ADGroups.indexOf(map.activeDirectoryName) >= 0) {
                for (var i = 0; i < constants.ROLES.length; i++) {
                  if (constants.ROLES[i].systemName === map.systemName) {
                    roles.push(constants.ROLES[i].systemName);
                    permissions = permissions.concat(constants.ROLES[i].permissions);
                    break;
                  }
                }
              }
            });
          }

          var userObject = {
            id: data.adUser.userPrincipalName,
            email: data.adUser.mail || data.adUser.userPrincipalName,
            firstName: data.adUser.givenName,
            lastName: data.adUser.sn,
            token: remoteToken,
            admin: false,
            accountId: remoteToken.accountId,
            roles: roles,
            groups: userGroups,
            permissions: permissions
          }

          console.log(userObject)
          return deferred.resolve(userObject)

        });


    } catch (ex) {
      console.log(ex)
      return deferred.reject('Failed to decode data object.')
    }
  })
  return deferred.promise
}

export default {
  add,
  checkPermision,
  buildUser,
  buildADUser,
  getUsersByAccount,
  getUsersByEmail
}