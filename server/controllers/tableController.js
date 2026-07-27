const adminService = require('../services/adminService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getTables = async (req, res) => {
    try {
        const tables = await adminService.getAllTables();
        return successResponse(res, tables, 'All tables fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const updateTableStatus = async (req, res) => {
    try {
        const { status, reservation, orderId, seatedAt } = req.body;
        const table = await adminService.updateTableStatus(
            req.params.id,
            status,
            reservation,
            orderId,
            seatedAt
        );
        return successResponse(res, table, 'Table status updated');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    getTables,
    updateTableStatus,
};
