import niceErrors from '../lib/nice_errors.js'
import Uuid from 'uuid'
import models from '../models'
import Boom from 'boom'


class GroupsControler {
  get(request, reply) {
    models.group.findOne({
      where: {
        accountUuid: request.auth.credentials.accountId,
        uuid: request.params.uuid
      },
      include: models.user
    })
      .then(group => {
        if (!group) {
          return reply(niceErrors("Failed to find group"))
        }

        return reply(group)
      })
      .catch(err => {
        reply(niceErrors("Failed to find group.", err))
      })
  }

  index(request, reply) {
    models.group.findAll({
      where: {
        accountUuid: request.auth.credentials.accountId,
      },
      include: models.user,
      order: '"isSystem" DESC'
    })
      .then(groups => reply(groups))
  }

  destroy(request, reply) {
    models.group.findOne({where: {
      accountUuid: request.auth.credentials.accountId,
      uuid : request.params.uuid
    }})
      .then(group => {
        if (!group) {
          return reply(niceErrors("Failed to find group"))
        }

        return group.destroy({force: true})
      })
      .then(() => {
        return reply('\"OK\"')
      })
      .catch(err => {
        return reply(niceErrors("Failed to delete group.",err))
      })
  }

  post(request, reply) {
    models.group.create({
      uuid:                request.payload.uuid,
      name:                request.payload.name,
      description:         request.payload.description,
      activeDirectoryName: request.payload.activeDirectoryName,
      accountUuid:         request.auth.credentials.accountId,
    })
      .then(savedGroup => {
        if (request.payload.userUuids) {
          return savedGroup.setUsers(request.payload.userUuids)
            .then(() => {
              return savedGroup
            })
            .catch(() => {
              throw new Error('Invalid User Uuids')
            })
        }

        return savedGroup
      })
      .then(finalGroup => {
        return reply(finalGroup.reload({include: [models.user]}))
      })
      .catch(err => {
        console.log(err)
        return reply(Boom.badRequest(err.message))
      })
  }

  put(request, reply) {
    models.group.findOne({where: {
      accountUuid: request.auth.credentials.accountId,
      uuid: request.params.uuid
    }})
      .then(group => {
        if (!group) {
          throw new Error('Failed to find the group')
        }
        if (request.payload.userUuids) {
          return group.setUsers(request.payload.userUuids)
            .then(()=>{
              return group
            })
            .catch(() =>{
              throw new Error('Invalid User Uuids')
            })
        }
      })
      .then((group)=>{
        return group.update({
          name:                request.payload.name,
          description:         request.payload.description,
          activeDirectoryName: request.payload.activeDirectoryName,
        })
      })
      .then(group => {
        return reply(group.reload({include: [models.user]}))
      })
      .catch(err => {
        console.error(err)
        return reply(Boom.badRequest(err))
      })
  }

}

export default new GroupsControler()
