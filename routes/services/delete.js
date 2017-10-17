import ServiceController from '../../controllers/serviceController.js'
import Joi from 'joi'

module.exports = {
    method: "DELETE",
    path: "/services/{uuid}",
    config: {
        tags: ['api'],
        notes: [],
        validate: {
            params: {
                uuid: Joi.string().required()
            }
        },
        handler: ServiceController.delete,
        auth: {
            mode: 'required',
            strategy: 'token'
        }
    },

};