const { body } = require('express-validator');

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

const googleAuthValidation = [
    body('token').notEmpty().withMessage('Google ID token is required'),
];

module.exports = {
    registerValidation,
    loginValidation,
    googleAuthValidation,
};
