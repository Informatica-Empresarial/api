import Uuid from 'uuid'
import async from 'async'
import models from '../models'

var users = [{
  uuid: Uuid.v4(),
  email: 'admin@admin.com',
  password: 'GetStartedAdmin!',
  roles: ['AccountAdmin', 'UserAdmin', 'StudioSolutionManager', 'MobileEndUser', ],
  firstName: 'Admin',
  admin: true,
  lastName: 'Admin',
  accountUuid: '00000000-0000-0000-0000-000000000000',
}

]

export default (callback) => {
  console.log("\tStarting User Seed");
  const User = models.user;

  async.eachSeries(users, (data, cb) => {

    User.findOne({
        where: {
          email: data.email
        }
      })
      .then(user => {
        if (user) {
          user.firstName = data.firstName
          user.lastName = data.lastName
          user.roles = data.roles

          user.save()
            .then(user => {
              console.log('\tFound User: ' + data.email + ', updating roles assigned;')
              return cb();
            })
        } else {
          console.log('\tCreating user: ' + data.email);
          var newUser = models.user.build(data);
          newUser.save().then(result => {
            return newUser.getAccount()
              .then(account => {
                return account.updateSystemGroup();
              })
              .then(() => {
                return cb();
              })
          })
        }
      });

  }, (err) => {
    if (err) {
      console.error(err);
    }

    console.log('\tUser Seed Done.')
    return callback(null);
  })

};