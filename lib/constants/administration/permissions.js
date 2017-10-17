var PERMISSION_NAMES = require('./permission_system_names')

module.exports = [
  {
    systemName:   PERMISSION_NAMES.MODIFY_ACCOUNT_INFORMATION,
    friendlyName: 'Account Admin',
    description:  'Can modify account information.',
    permissions: []
  },
  {
    systemName:   PERMISSION_NAMES.MODIFY_ADMIN_USERS,
    friendlyName: 'Modify Admin User',
    description:  'Can add, modify, and remove admin users.',
    permissions: []
  },
  {
    systemName:   PERMISSION_NAMES.MODIFY_NON_ADMIN_USERS,
    friendlyName: 'Can modify non-admin users.',
    description:  'Can add, modify, and remove non-admin users.',
    permissions: []
  },
  {
    systemName:   PERMISSION_NAMES.SOLUTION_MANAGER,
    friendlyName: 'Solution Manager',
    description:  'Can add, modify, remove, and publish solutions.',
    permissions: []
  }
]
