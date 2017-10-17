import Q from 'q'
import userLib from '../userHelper'
import models from '../../models'

export default (token) => {
  var deferred = Q.defer()

  if (!token) {
    deferred.reject('Authentication token is required')
    return deferred.promise
  }

  // If the token is JSON, then its coming from a domain controller.
  if (token.indexOf('{') === 0) {
    var match = /^(\{.*\})$/.exec(token)
    if (!match) {
      deferred.reject('Failed to match regex.')
      return deferred.promise
    }

    var remoteToken = JSON.parse(match[1])

    return userLib.buildADUser(remoteToken)
  }

  // its a local DB token

  models.user.findOne({
    where: { token },
    include: [models.group]
  })
    .then(user => {
      if (!user) {
        deferred.reject('User not found for given token')
      } else {
        return userLib.buildUser(user)
          .then(result => {
            deferred.resolve(result)
          })
      }
    })

  return deferred.promise
}
