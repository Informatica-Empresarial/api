import uuid from 'uuid';
import userlib from './userHelper';
import models from '../models';

class AccountLib {
  add(model, callback) {
    var account = models.account.build({
      uuid: uuid.v4(),
      name: model.name,
      privateKey: model.privateKey,
      groups: model.groups,
      fileServerHostName: model.fileServerHostName
    })

    account.save()
      .then(function () {
        userlib.add({
          uuid: uuid.v4(),
          firstName: 'Worker',
          lastName: 'Worker',
          email: 'worker@' + account.name,
          password: uuid.v4(),
          accountUuid: account.uuid,
          admin: false,
          workerAccount: true,
          roles: []
        }, function (err, user) {
          account.updateSystemGroup()
            .then(() => {
              return callback(err, account)
            })
        })
      })
  }

  get(uuid) {
    return new Promise(function (resolve, reject) {
      models.account.findOne({
          where: {
            uuid
          }
        })
        .then(function (account) {
          resolve(account)
        })
    })
  }
}

export default new AccountLib()