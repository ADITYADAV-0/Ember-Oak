const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getProfile = async (req, res) => {
    try {
        return successResponse(res, req.user, 'User profile fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const updateProfile = async (req, res) => {
    try {
        const updatedUser = await userService.updateProfile(req.user.id, req.body);
        return successResponse(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return successResponse(res, users, 'All users fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
};
