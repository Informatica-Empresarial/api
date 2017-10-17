var PERMISSION_NAMES = require('./permission_system_names');
var ROLE_NAMES = require("./role_system_names");

module.exports = [
  {
    systemName:   ROLE_NAMES.ACCOUNT_ADMIN,
    friendlyName: 'Account Admin',
    description:  'Can modify account information.',
    permissions: [PERMISSION_NAMES.MODIFY_ACCOUNT_INFORMATION,PERMISSION_NAMES.MODIFY_ADMIN_USERS,PERMISSION_NAMES.MODIFY_NON_ADMIN_USERS,
                  PERMISSION_NAMES.SERVICE_SPECIALIST, PERMISSION_NAMES.SOLUTION_MANAGER ]
  },
  {
    systemName:   ROLE_NAMES.USER_ADMIN,
    friendlyName: 'User Admin',
    description:  'Can add, modify, and remove users.',
    permissions: [PERMISSION_NAMES.MODIFY_NON_ADMIN_USERS, PERMISSION_NAMES.MODIFY_ADMIN_USERS]
  },
  {
    systemName:   ROLE_NAMES.SERVICE_SPECIALIST,
    friendlyName: 'Service Specialist',
    description:  'Allows the user to perform services.',
    permissions: [PERMISSION_NAMES.SERVICE_SPECIALIST]
  },
  {
    systemName:   ROLE_NAMES.CUSTOMER_USER,
    friendlyName: 'Mobile End User,  allows the user to request services',
    description:  'Allow a user to use mobile apps  and request services',
    permissions: [PERMISSION_NAMES.SERVICE_REQUESTER]
  }
];
