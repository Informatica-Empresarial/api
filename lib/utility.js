import _ from 'lodash'
import cities from 'all-the-cities'
import citiesAvailability from './constants/administration/citiesAvailability.js'

class Utility {

    assignIfExist(object, params) {
        let validUpdateObject = {}
        _.forIn(params, function (value, key) {
            if (value) {
                validUpdateObject[key] = value
            }
        })

        return _.assign(object, validUpdateObject)
    }

    getCities(query, attr = 'country') {
        let country = (query.country) ? query.country : 'CO'
        let name = query.city
        switch (attr) {
            case 'country':
                let cities1 = _.filter(cities, {
                    country: country
                });
                cities1.forEach(city => {
                    var selectable  =false;
                    for(let i = 0; i<citiesAvailability.availableCities.length ;i++){
                        if(citiesAvailability.availableCities[i] === city.name){
                            selectable = true;
                            break;
                        }
                    }
                    city.selectable = selectable
                }, this);

                return cities1;
            case 'name':
                return _.find(cities, {
                    name: name
                })
        }
    }

    includeParams(acceptedKeys, query) {
        var where = {}
        _.forEach(query, (data, key) => {
            if (_.includes(acceptedKeys, key) && data) {
                where[key] = data
            }
        })
        return where
    }


    rejectParams(rejectedKeys, query) {
        var where = {}
        _.forEach(query, (data, key) => {
            if (!_.includes(rejectedKeys, key) && data) {
                where[key] = data
            }
        })
        return where
    }



}

export default new Utility()