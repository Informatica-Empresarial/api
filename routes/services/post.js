import ServiceController from '../../controllers/serviceController'
import Joi from 'joi'

module.exports = {
    method: "POST",
    path: "/services",
    config: {
        tags: ['api'],
        notes: [],
        validate: {
            payload: {
                alias: Joi.string().optional().allow(''), 
                name: Joi.string().required(), 
                description: Joi.string().optional().allow(''), 
                items: Joi.array().optional().allow(null), 
                tags: Joi.array().optional().allow(null), 
                imageUrl: Joi.string().optional(), 
                instruction: Joi.string().optional(), 
                currency: Joi.string().valid(['COP','USD']), 
                price: Joi.number().required(), 
                maxCount: Joi.number().optional(), 
                minutes_duration: Joi.number().required(), 
                order: Joi.number().optional().allow(null), 
                enabled: Joi.boolean().optional(),
                serviceAvailabilities: Joi.array().items(Joi.object({
                    enabled: Joi.boolean().required(),
                    name: Joi.string().optional().allow(''),
                    lat : Joi.number().required(),
                    lng : Joi.number().required(),
                    radius: Joi.number().required(),                   
                })).optional(),
                groupUuids: Joi.array().optional()
            }
        },
        handler: ServiceController.create,
        auth: {
            mode: 'required',
            strategy: 'token'
        }
    },

};