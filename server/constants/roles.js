const ROLES = {
    CUSTOMER: 'customer',
    WAITER: 'waiter',
    CHEF: 'chef',
    HOST: 'host',
    MANAGER: 'manager',
    ADMIN: 'admin'
};

const STAFF_ROLES = [ROLES.WAITER, ROLES.CHEF, ROLES.HOST, ROLES.MANAGER, ROLES.ADMIN];

module.exports = {
    ROLES,
    STAFF_ROLES
};
