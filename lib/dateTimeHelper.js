import _ from 'lodash'
import moment from 'moment'

class DateTimeHelper {

    addTo(date, value, unit='minutes', format=true) {
        date = this.castToMoment(date).add(value, unit)
        let returnDate = (format) ? date.utc().format() : date
        return returnDate
    }

    castToMoment(date) {
        date = this.validateUTC(date)
        date = moment(date)
        if (!date) {
            throw new Error('Invalid date format') 
        }
        return date
    }

    round(fromStartDateTime, roundFactor = 30) {
        fromStartDateTime = this.validateUTC(fromStartDateTime)
        fromStartDateTime = (fromStartDateTime) ? moment(fromStartDateTime) : moment(new Date())
        let remainder = roundFactor - fromStartDateTime.minute() % roundFactor
        return moment(fromStartDateTime).add("minutes", remainder ).utc().format()   
    }

    validateUTC(startDateTime) {
        if (!startDateTime) {
            return moment().utc().format()
        }

        if (startDateTime.toString().charAt(startDateTime.toString().length - 1) !== 'Z') {
            startDateTime = startDateTime + 'Z'
        }   

        if (!moment(startDateTime).isValid()) {
            return moment().utc().format()
        } else {
            return moment(startDateTime).utc().format()
        }
    }

}

export default new DateTimeHelper()