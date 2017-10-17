
import PERMISSION_SYSTEM_NAMES from './administration/permission_system_names'
import PERMISSIONS from './administration/permissions'
import ROLE_SYSTEM_NAMES from './administration/role_system_names'
import ROLES from './administration/roles'
import DEFAULT_AVAILABILITY from './appointments/default_availability.js'
import DEFAULT_AVAILABILITY_MORNING from './appointments/default_availability_morning.js'
import DEFAULT_AVAILABILITY_AFTERNOON from './appointments/default_availability_afternoon.js'
import TIME_RANGES from './appointments/time_ranges.js'
import DISTANCE_RANGES from './appointments/distance_ranges.js'
import NOTIFICAIONS from './notifications/index.js'


export default {
    /** all constants */
    all() {
      return {
        PERMISSION_SYSTEM_NAMES,
        PERMISSIONS,
        ROLE_SYSTEM_NAMES,
        ROLES,
        DEFAULT_AVAILABILITY,
        TIME_RANGES,
        DISTANCE_RANGES,
        NOTIFICAIONS,
        DEFAULT_AVAILABILITY_MORNING,
        DEFAULT_AVAILABILITY_AFTERNOON
      }
    },

    /** constants set for the mobile apps */  //TODO: optimize for mobile.
    mobile() {
      return {
        PERMISSION_SYSTEM_NAMES,
        PERMISSIONS,
        ROLE_SYSTEM_NAMES,
        ROLES,
        NOTIFICAIONS
      }
    },

    /** constants set for the studio */  //TODO: optimize for studio.
    studio() {
      return {

        PERMISSION_SYSTEM_NAMES,
        PERMISSIONS,
        ROLE_SYSTEM_NAMES,
        ROLES,
        DEFAULT_AVAILABILITY
      }
    },
}
