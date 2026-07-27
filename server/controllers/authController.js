const authService = require('../services/authService');
const { sendTokenResponse } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await authService.register({ name, email, password, role });
        return sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login({ email, password });
        return sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
        return errorResponse(res, error.message, 401);
    }
};

const googleAuth = async (req, res, next) => {
    try {
        const { token, isStaff } = req.body;
        const user = await authService.googleAuth({ token, isStaff });
        return sendTokenResponse(user, 200, res, 'Google authentication successful');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    return successResponse(res, null, 'Logged out successfully');
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.id);
        return successResponse(res, user, 'Current user profile fetched');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

module.exports = {
    register,
    login,
    googleAuth,
    logout,
    getMe,
};
