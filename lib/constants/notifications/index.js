export default {
    'SCHEDULED_CUSTOMER':{
        active: true,
        IOS: true,
        Android: true,
        titleAux:'Tu cita fue confirmada',
        messageAux:'Tu cita fue confirmada',
        additionalPayload:{
            "action":"newAppointment"
        }
    },
    'SCHEDULED_SPECIALIST':{
        active: true,
        IOS: true,
        Android: true,        
        titleAux:'Hemos confirmado una cita para ti',
        messageAux:'Hemos confirmado una cita para ti',
        additionalPayload:{
            "action":"newAppointment"
        }
    },
    'RATE_USER':{
        active: true,
        IOS: true,
        Android: true,        
        titleAux:'Cuentanos como te parecio el servicio',
        messageAux:'Cuentanos como te parecio el servicio',
        additionalPayload:{
            "action":"rate"
        }
    },
    'CANCELED_USER':{
        active: true,
        IOS: true,
        Android: true,        
        titleAux:'Tu especialista ha tenido un contratiempo y tuvo que cancelar',
        messageAux:'Tu especialista ha tenido un contratiempo y tuvo que cancelar',
        additionalPayload:{
            "action":"appointmentCancelled"
        }
    },
    'CANCELED_SPECIALIST':{
        active: true,
        IOS: true,
        Android: true,        
        titleAux:'El cliente ha cancelado la cita',
        messageAux:'El cliente ha cancelado la cita',
        additionalPayload:{
            "action":"appointmentCancelled"
        }
    },
    'SOS_SPECIALIST':{
        active: true,
        IOS: true,
        Android: true,        
        titleAux:'Tienes una nueva cita SOS',
        messageAux:'Tienes una nueva cita SOS',
        additionalPayload:{
            "action":"sos"
        }
    },
    'SOS_USER':{
        active: true,
        IOS: true,
        Android: true,        
        titleAux:'Hemos encontrado tu especialista SOS',
        messageAux:'Hemos encontrado tu especialista SOS',
        additionalPayload:{
            "action":"sos"
        }
    },
    NOTIFICATIONS_ENABLED: true

}