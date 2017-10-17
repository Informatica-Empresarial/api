import nError from '../lib/nice_errors'
import _ from 'lodash'
import Uuid from 'uuid'
import user from '../lib/userHelper'
import Boom from 'boom'

import accountLib from '../lib/accountHelper'
import ROLES from '../lib/constants/administration/role_system_names'
import models from '../models'


class AccountsController {
  createDemoAccount(request, reply) {
    models.account.create({
        name: request.payload.name,
        isDemo: true
      })
      .then(account => {
        let users = [{
            email: request.payload.email.toLowerCase(),
            firstName: request.payload.firstName,
            lastName: request.payload.lastName,
            password: request.payload.password,
            accountUuid: account.uuid,
            roles: _.values(ROLES)
          },
          {
            email: 'worker@' + account.name,
            firstName: 'Worker',
            lastName: 'Worker',
            password: Uuid.v4(),
            accountUuid: account.uuid,
            admin: false,
            workerAccount: true
          }
        ]

        return models.user.bulkCreate(users, {
          individualHooks: true,
          validate: true
        })
      })
      .then(users => {
        return reply('Successfully created the demo account').code(201)
      })
      .catch(error => {
        console.error(error)
        return reply(Boom.badRequest('Failed to create demo account'))
      })
  }

  update(request, reply) {
    if (!request.payload) {
      return reply('Nothing to update.')
    }

    if (!request.payload.checkedOutSolutionUuid && !user.checkPermision('ModifyAccountInformation', request)) {
      return reply(Boom.forbidden("You don't have the required permission."))
    }

    var data = request.payload

    models.account.findOne({
        where: {
          uuid: request.auth.credentials.accountUuid
        }
      })
      .then(account => {
        return account.update(data)
      })
      .then(() => {
        return reply(1)
      })
      .catch(err => {
        return reply(Boom.badImplementation("\"ERROR\"", err))
      })

  }

  get(request, reply) {
    models.account.findOne({
        where: {
          uuid: request.auth.credentials.accountId
        },
        include: [models.group, models.ad_roles_map]
      })
      .then(account => {
        if (!account) {
          return reply(Boom.notFound('Cannot found an account with uuid: ' + request.params.uuid))
        }

        let result = {
          id: account.uuid,
          name: account.name,
          permissions: account.permissions,
          groups: account.groups,
          fileServerHostName: account.fileServerHostName,
          adRolesMap: account.ad_roles_maps,
          publicKey: account.publicKey,
          remoteAuthUrl: account.remoteAuthUrl,
          TOS: account.TOS,
          descriptions: account.descriptions,
          images: account.images
        };

        return reply(result)
      })
      .catch(err => {
        return reply(Boom.badImplementation("\"ERROR\"", err))
      })
  }

}

export default new AccountsController()