const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

class MenuService {
    async getAllMenuItems(filters = {}) {
        const query = {};

        if (filters.category && filters.category !== 'All') {
            query.category = filters.category;
        }

        if (filters.available !== undefined) {
            query.available = filters.available === 'true';
        }

        if (filters.dietary) {
            const dietaryList = Array.isArray(filters.dietary)
                ? filters.dietary
                : [filters.dietary];
            query.dietary = { $all: dietaryList };
        }

        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } },
            ];
        }

        return await MenuItem.find(query).sort({ popular: -1, createdAt: -1 });
    }

    async getMenuItemById(id) {
        const item = await MenuItem.findById(id);
        if (!item) {
            throw new Error('Menu item not found');
        }
        return item;
    }

    async createMenuItem(itemData) {
        return await MenuItem.create(itemData);
    }

    async updateMenuItem(id, updateData) {
        const item = await MenuItem.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            throw new Error('Menu item not found');
        }
        return item;
    }

    async deleteMenuItem(id) {
        const item = await MenuItem.findByIdAndDelete(id);
        if (!item) {
            throw new Error('Menu item not found');
        }
        return item;
    }

    async getAllCategories() {
        return await Category.find().sort({ order: 1 });
    }

    async createCategory(categoryData) {
        return await Category.create(categoryData);
    }
}

module.exports = new MenuService();
