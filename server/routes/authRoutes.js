const express = require('express');
const router = express.Router();
const { register, login, googleAuth, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
    registerValidation,
    loginValidation,
    googleAuthValidation,
} = require('../validators/authValidator');

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/google', googleAuthValidation, validate, googleAuth);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
