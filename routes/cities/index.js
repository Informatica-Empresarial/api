
import Utility from '../../lib/utility'
import Joi from 'joi'
import _  from 'lodash'



module.exports = [
    {
        method: "GET",
        path: "/city",
        config: {
            tags: ['api'],
            notes: ['Get all services available on the current account'],
            validate: {
                query:{
                    country: Joi.string().optional(),
                    city: Joi.string().optional()
                }
            },
            handler: (request, reply) =>{
                const query = request.query
                const city = request.query.city
                const attr = (city) ? 'name' : 'country'
                let cities = Utility.getCities(query, attr)

                cities = _.map(cities, city =>{
                    city['lng'] = city.lon
                    return city
                })

                reply(cities)
            }
        }

    }
]