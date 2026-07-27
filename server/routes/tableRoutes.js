const express = require('express');
const router = express.Router();
const { getTables, updateTableStatus } = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { STAFF_ROLES } = require('../constants/roles');

router.get('/', getTables);
router.put('/:id/status', protect, authorizeRoles(...STAFF_ROLES), updateTableStatus);

module.exports = router;
