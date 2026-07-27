const express = require('express');
const router = express.Router();
const {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservationStatus,
    cancelReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { createReservationValidation } = require('../validators/reservationValidator');
const { STAFF_ROLES } = require('../constants/roles');

router.post('/', createReservationValidation, validate, createReservation);
router.get('/my-reservations', getMyReservations);
router.get('/', protect, authorizeRoles(...STAFF_ROLES), getAllReservations);
router.put('/:id/status', protect, authorizeRoles(...STAFF_ROLES), updateReservationStatus);
router.delete('/:id', cancelReservation);

module.exports = router;
