const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { createOrderValidation } = require('../validators/orderValidator');
const { STAFF_ROLES } = require('../constants/roles');

router.post('/', createOrderValidation, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, authorizeRoles(...STAFF_ROLES), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, authorizeRoles(...STAFF_ROLES), updateOrderStatus);

module.exports = router;
