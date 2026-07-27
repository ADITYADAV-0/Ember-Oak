const express = require('express');
const router = express.Router();
const { getPoints, redeemPoints } = require('../controllers/loyaltyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/points', protect, getPoints);
router.post('/redeem', protect, redeemPoints);

module.exports = router;
