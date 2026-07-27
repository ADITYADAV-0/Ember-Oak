const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const PAYMENT_STATUS = {
    UNPAID: 'unpaid',
    PAID: 'paid'
};

const ORDER_TYPE = {
    DINE_IN: 'dine-in',
    TAKEAWAY: 'takeaway'
};

const RESERVATION_STATUS = {
    CONFIRMED: 'confirmed',
    PENDING: 'pending',
    CANCELLED: 'cancelled',
    SEATED: 'seated'
};

const TABLE_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved',
    CLEANING: 'cleaning'
};

const TABLE_ZONE = {
    INDOOR: 'indoor',
    OUTDOOR: 'outdoor',
    PRIVATE: 'private'
};

module.exports = {
    ORDER_STATUS,
    PAYMENT_STATUS,
    ORDER_TYPE,
    RESERVATION_STATUS,
    TABLE_STATUS,
    TABLE_ZONE
};
