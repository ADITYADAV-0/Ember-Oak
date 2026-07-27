const reservationService = require('../services/reservationService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body);
        return successResponse(res, reservation, 'Reservation created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const getMyReservations = async (req, res) => {
    try {
        const email = req.user ? req.user.email : req.query.email;
        if (!email) {
            return errorResponse(res, 'Email is required to fetch reservations', 400);
        }
        const reservations = await reservationService.getReservationsByEmail(email);
        return successResponse(res, reservations, 'User reservations fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations();
        return successResponse(res, reservations, 'All reservations fetched');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const updateReservationStatus = async (req, res) => {
    try {
        const { status, tableId } = req.body;
        const reservation = await reservationService.updateReservationStatus(
            req.params.id,
            status,
            tableId
        );
        return successResponse(res, reservation, 'Reservation status updated');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const cancelReservation = async (req, res) => {
    try {
        const reservation = await reservationService.cancelReservation(req.params.id);
        return successResponse(res, reservation, 'Reservation cancelled successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservationStatus,
    cancelReservation,
};
