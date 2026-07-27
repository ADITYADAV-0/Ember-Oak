const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getCategories,
    createCategory,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { menuItemValidation } = require('../validators/menuValidator');
const { ROLES } = require('../constants/roles');

router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Staff / Admin protected routes
router.post(
    '/',
    protect,
    authorizeRoles(ROLES.MANAGER, ROLES.ADMIN, ROLES.CHEF),
    menuItemValidation,
    validate,
    createMenuItem
);

router.put(
    '/:id',
    protect,
    authorizeRoles(ROLES.MANAGER, ROLES.ADMIN, ROLES.CHEF),
    updateMenuItem
);

router.delete(
    '/:id',
    protect,
    authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
    deleteMenuItem
);

router.post(
    '/categories',
    protect,
    authorizeRoles(ROLES.MANAGER, ROLES.ADMIN),
    createCategory
);

module.exports = router;
