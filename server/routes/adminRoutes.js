const express = require('express');
const router = express.Router();
const { getDashboardOverview, getSettings, updateSettings } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { ROLES } = require('../constants/roles');

router.use(protect);
router.use(authorizeRoles(ROLES.MANAGER, ROLES.ADMIN));

router.get('/overview', getDashboardOverview);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
