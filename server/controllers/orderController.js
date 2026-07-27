const orderService = require('../services/orderService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body, req.user);
        return successResponse(res, order, 'Order placed successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrdersByUser(req.user._id || req.user.id);
        return successResponse(res, orders, 'User orders fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders(req.query);
        return successResponse(res, orders, 'All orders fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        return successResponse(res, order, 'Order details');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await orderService.updateOrderStatus(req.params.id, status, paymentStatus);
        return successResponse(res, order, 'Order status updated');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};
