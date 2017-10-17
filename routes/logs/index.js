import Joi from 'joi'
import logController from '../../controllers/logController'

let auth = {
  mode: 'required',
  strategy: 'token'
}

export default [
  {
    method: 'GET',
    path: "/logs/{uuid}",
    handler: logController.get,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        },
      },
      auth
    }
  },

  {
    method: 'GET',
    path: "/logs",
    handler: logController.index,
    config: {
      tags: ['api'],
      validate: {
        query: {
          solutionUuid:        Joi.string().optional(),          
          startDate:               Joi.date().optional(),
          endDate:                Joi.date().optional(),
        }
      },
      auth
    }
  },
  
  {
    method: 'POST',
    path: '/logs',
    handler: logController.post,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          uuid:                Joi.string().optional(),
          solutionUuid:        Joi.string().optional(),
          eventNumber:         Joi.number().optional(),
          eventText:           Joi.string().optional(),
          eventType:           Joi.string().optional(),
          when:                Joi.date().optional(),
          exceptionType:       Joi.string().optional(),
          exceptionText:       Joi.string().optional(),
          level:               Joi.string().optional(),
          json:                Joi.object().optional(),
        }
      },
      auth
    }
  }

]
