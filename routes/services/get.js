import ServiceController from '../../controllers/serviceController.js'
import Joi from 'joi'

module.exports = [
    {
        method: "GET",
        path: "/services",
        config: {
            tags: ['api'],
            notes: ['Get all services available on the current account'],
            validate: {
                query:{
                    enabled: Joi.boolean().optional(),
                    currency: Joi.string().valid(['COP','USD']),
                    lat : Joi.number().optional(),
                    lng : Joi.number().optional(),
                    city: Joi.string().optional(),
                }
            },
            handler: ServiceController.index,
            auth: {
                mode: 'required',
                strategy: 'token'
            }
        }

    },
    {
        method: "GET",
        path: "/services/{uuid}",
        config: {
            tags: ['api'],
            notes: ['Get service by uuid'],
            validate: {
                params:{
                    uuid: Joi.string().required(),
                }
            },
            handler: ServiceController.getServiceByUuid,
            auth: {
                mode: 'required',
                strategy: 'token'
            }
        }

    }
]