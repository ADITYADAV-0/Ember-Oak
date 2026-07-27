const loyaltyService = require('../services/loyaltyService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getPoints = async (req, res) => {
    try {
        const data = await loyaltyService.getUserPoints(req.user.id);
        return successResponse(res, data, 'Loyalty points fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const redeemPoints = async (req, res) => {
    try {
        const { points, description } = req.body;
        const result = await loyaltyService.redeemPoints(
            req.user.id,
            points,
            description || 'Redeemed points'
        );
        return successResponse(res, result, 'Points redeemed successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    getPoints,
    redeemPoints,
};
