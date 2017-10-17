import niceErrors from '../lib/nice_errors.js'
import Uuid from 'uuid'
import models from '../models'
import Boom from 'boom'
import usageLog from "../lib/logsHelper.js";

class LogControler {
  get(request, reply) {
    models.log.findOne({
      where: {
        accountUuid: request.auth.credentials.accountId,
        uuid: request.params.uuid
      }
    })
      .then(log => {
        if (!log) {
          return reply(niceErrors("Failed to find log"))
        }

        return reply(log)
      })
      .catch(err => {
        reply(niceErrors("Failed to find log.", err))
      })
  }

  index(request, reply) {

    var where ={
        accountUuid: request.auth.credentials.accountId,
      }; 
      
      if(request.query.startDate && request.query.endDate)
      {
        where.when = {$gte: request.query.startDate, $lte: request.query.endDate};
      }
      else if(request.query.startDate)
      {
        where.when = {$gte: request.query.startDate};
      }      
      else if(request.query.endDate)
      {
        where.when = {$lte: request.query.endDate};
      }

      if(request.query.solutionUuid)
      {
        where.solutionUuid = request.query.solutionUuid;
      }      


    models.log.findAll({
      where: where 
    })
      .then(logs => reply(logs))
  }

  post(request, reply) {
    var log = models.log.build({
      uuid: request.payload.uuid,
      accountUuid: request.auth.credentials.accountId,
      userUuid: request.auth.credentials.uuid,
      objectUuid: request.payload.objectUuid,
      userEmail: request.auth.credentials.email,
      eventNumber: request.payload.eventNumber,
      eventText: request.payload.eventText,
      eventType: request.payload.eventType,
      exceptionType: request.payload.exceptionType,
      exceptionText: request.payload.exceptionText,
      level: request.payload.level,
      json: request.payload.json,
    })


    if (request.payload.when)      // to get a default date we have to do this since its not a pk.
    {
      log.when = request.payload.when;
    }

    log.save()
      .then(() => {
        return reply(log)
      })
      .catch(err => {
        console.log(err)
        return reply(niceErrors("Failed to save log.", err))
      })
  }

}

export default new LogControler()
