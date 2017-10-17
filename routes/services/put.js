import ServiceController from '../../controllers/serviceController.js'
import Joi from 'joi'

module.exports = {
    method: "PUT",
    path: "/services/{uuid}",
    config: {
        tags: ['api'],
        notes: [],
        validate: {
            payload: {
                alias: Joi.string().optional().allow(''), 
                name: Joi.string().optional(), 
                description: Joi.string().optional().allow(''), 
                items: Joi.array().optional().allow(null), 
                tags: Joi.array().optional().allow(null), 
                imageUrl: Joi.string().optional(), 
                instruction: Joi.string().optional(), 
                currency: Joi.string().valid(['COP','USD']), 
                maxCount: Joi.number().optional(), 
                price: Joi.number().optional(), 
                minutes_duration: Joi.number().optional(), 
                enabled: Joi.boolean().optional(),
                order: Joi.number().required().allow(null), 
                serviceAvailabilities: Joi.array().items(Joi.object({
                    enabled: Joi.boolean().optional(),
                    lat : Joi.number().optional(),
                    name: Joi.string().optional().allow(''),
                    lng : Joi.number().optional(),
                    radius: Joi.number().optional(),                   
                })).optional(),
                groupUuids: Joi.array().optional()

            },
            params: {
                uuid: Joi.string().required()
            }
        },
        handler: ServiceController.update,
        auth: {
            mode: 'required',
            strategy: 'token'
        }
    },

};