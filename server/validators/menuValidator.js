const { body } = require('express-validator');

const menuItemValidation = [
    body('name').trim().notEmpty().withMessage('Item name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().isString(),
];

module.exports = {
    menuItemValidation,
};
