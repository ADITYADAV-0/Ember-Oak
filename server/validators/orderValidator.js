const { body } = require('express-validator');

const createOrderValidation = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required'),
    body('items.*.name').notEmpty().withMessage('Item name is required'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Item price must be positive'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
    body('total').isFloat({ min: 0 }).withMessage('Total must be positive'),
];

module.exports = {
    createOrderValidation,
};
