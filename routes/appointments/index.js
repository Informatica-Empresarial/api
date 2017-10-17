import Joi from 'joi'
import AppointmentsController from '../../controllers/appointmentsController'

let auth = {
  mode: 'required',
  strategy: 'token'
}

export default [

  {
    method: 'GET',
    path: "/appointments",
    handler: AppointmentsController.index,
    config: {
      validate:{
        query:{
          status: Joi.string().valid(['scheduled', 'delivered', 'canceled', 'blockedTime']).optional(), 
          specialistUuid: Joi.string().optional(), 
          customerUuid : Joi.string().optional()
        }
      },
      tags: ['api'],
      auth
    }
  },
  {
    method: 'POST',
    path: "/appointments/availability",
    handler: AppointmentsController.getAvailability,
    config: {
      validate:{
        payload: {
          specialistUuid: Joi.string().optional(),
          fromDateTime: Joi.string().optional(),
          toDateTime: Joi.string().optional(),
          lat : Joi.number().required(),
          lng : Joi.number().required(),              
          appointmentServices: Joi.array().items(Joi.object({
            serviceUuid : Joi.string().required(),
            count : Joi.number().required()
          })).required()
        }
      },
      tags: ['api'],
      auth
    }
  },
  {
    method: 'POST',
    path: "/appointments/{uuid}/ratings",
    handler: AppointmentsController.postAppointmentRating,
    config: {
      validate:{
        params:{
          uuid: Joi.string().required()
        },
        payload: {
          rating: Joi.number().valid(1,2,3,4,5),
          comments: Joi.string().optional().allow(''),
          userUuid : Joi.string().required(),
        }
      },
      tags: ['api'],
      auth
    }
  },
  {
    method: 'POST',
    path: "/appointments/availability/SOS",
    handler: AppointmentsController.getAvailabilitySOS,
    config: {
      validate:{
        payload: {
          specialistUuid: Joi.string().optional(),
          lat : Joi.number().required(),
          lng : Joi.number().required(),              
          appointmentServices: Joi.array().items(Joi.object({
            serviceUuid : Joi.string().required(),
            count : Joi.number().required()
          })).required()
        }
      },
      tags: ['api'],
      auth
    }
  },
  {
    method: 'GET',
    path: "/appointments/{uuid}",
    handler: AppointmentsController.getByUuid,
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
    method: "DELETE",
    path: "/appointments/{uuid}",
    handler: AppointmentsController.delete,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        }
      },
      auth: {
        mode: 'required',
        strategy: 'token'
      },
    }
  },

  {
    method: 'POST',
    path: '/appointments',
    handler: AppointmentsController.create,
    config: {
      tags: ['api'],
      validate: {
        payload: {
          startDateTime: Joi.string().optional(),
          customerUuid: Joi.string().optional(),
          specialistUuid: Joi.string().optional(),
          location: Joi.object({
            lat : Joi.number().required(),
            lng : Joi.number().required(),
            address: Joi.string().required()                 
          }).optional(),
          hasDiscountCoupon: Joi.boolean().optional(),
          discountCoupon: Joi.string().optional(),
          appointmentServices: Joi.array().items(Joi.object({
            serviceUuid : Joi.string().required(),
            count : Joi.number().required()
          })).required()
        }
      },
      auth
    }
  },
  {
    method: "PUT",
    path: "/appointments/{uuid}/schedule",
    handler: AppointmentsController.schedule,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        },
        payload: {
          sos: Joi.boolean().optional()
        },
        query: {
          sos: Joi.boolean().optional()
        }
      },
      auth
    }
  },
  {
    method: "PUT",
    path: "/appointments/{uuid}/cancel",
    handler: AppointmentsController.cancel,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        }
      },
      auth
    }
  },
  {
    method: "PUT",
    path: "/appointments/{uuid}/start",
    handler: AppointmentsController.start,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        }
      },
      auth
    }
  },
  {
    method: "PUT",
    path: "/appointments/{uuid}/deliver",
    handler: AppointmentsController.deliver,
    config: {
      tags: ['api'],
      validate: {
        params: {
          uuid: Joi.string().required()
        }
      },
      auth
    }
  }
]
