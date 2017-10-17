import Uuid from 'uuid';
import async from 'async';
import models from '../models';
import userlib from '../lib/userHelper';

//testing strider


var accounts = [{
  uuid: '00000000-0000-0000-0000-000000000000',
  name: 'Main Account',
  privateKey: null,
  groups: [],
  fileServerHostName: "" //TODO:  Pull from config based on env.
}];

export default (callback) => {
  console.log("\tStarting Account Seed.");

  async.each(accounts, function (data, cb) {
    models.account.findOne({
        where: {
          name: data.name
        }
      })
      .then((account) => {
        if (account !== undefined && account !== null) {
          console.log('\tFound Account: ' + data.name + ', skipping create.');
          return cb();
        } else {
          //TODO:  Unify this with the ../lib/account.js add().  -JB
          var newAccount = models.account.build(data);

          newAccount.save().then(function () {
            userlib.add({
              uuid: Uuid.v4(),
              firstName: 'Worker',
              lastName: 'Worker',
              email: 'worker@' + newAccount.name,
              password: Uuid.v4(),
              accountUuid: newAccount.uuid,
              roles: []
            }, function (err, user) {
              newAccount.updateSystemGroup()
                .then(() => {
                  return cb();
                });
            });
          });
        }
      });
  }, function (err) {
    console.log("\tAccount Seed Done.");
    return callback();
  });
};