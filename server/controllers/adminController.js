const adminService = require('../services/adminService');
const RestaurantSettings = require('../models/RestaurantSettings');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getDashboardOverview = async (req, res) => {
    try {
        const metrics = await adminService.getDashboardMetrics();
        return successResponse(res, metrics, 'Admin dashboard overview fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getSettings = async (req, res) => {
    try {
        let settings = await RestaurantSettings.findOne();
        if (!settings) {
            settings = await RestaurantSettings.create({});
        }
        return successResponse(res, settings, 'Restaurant settings fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const updateSettings = async (req, res) => {
    try {
        let settings = await RestaurantSettings.findOne();
        if (!settings) {
            settings = await RestaurantSettings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        return successResponse(res, settings, 'Restaurant settings updated');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    getDashboardOverview,
    getSettings,
    updateSettings,
};
