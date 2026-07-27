const { body } = require('express-validator');

const createReservationValidation = [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Valid customer email is required'),
    body('customerPhone').trim().notEmpty().withMessage('Customer phone is required'),
    body('date').notEmpty().withMessage('Reservation date is required'),
    body('time').notEmpty().withMessage('Reservation time is required'),
    body('partySize').isInt({ min: 1 }).withMessage('Party size must be at least 1'),
];

module.exports = {
    createReservationValidation,
};
