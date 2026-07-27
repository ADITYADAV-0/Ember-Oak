const menuService = require('../services/menuService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const getMenuItems = async (req, res) => {
    try {
        const items = await menuService.getAllMenuItems(req.query);
        return successResponse(res, items, 'Menu items fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const item = await menuService.getMenuItemById(req.params.id);
        return successResponse(res, item, 'Menu item details');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

const createMenuItem = async (req, res) => {
    try {
        const item = await menuService.createMenuItem(req.body);
        return successResponse(res, item, 'Menu item created successfully', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const item = await menuService.updateMenuItem(req.params.id, req.body);
        return successResponse(res, item, 'Menu item updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        await menuService.deleteMenuItem(req.params.id);
        return successResponse(res, null, 'Menu item deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await menuService.getAllCategories();
        return successResponse(res, categories, 'Categories fetched successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await menuService.createCategory(req.body);
        return successResponse(res, category, 'Category created', 201);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

module.exports = {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getCategories,
    createCategory,
};
