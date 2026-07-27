const User = require('../models/User');

class UserService {
    async updateProfile(userId, updateData) {
        const allowedUpdates = ['name', 'preferences', 'dietary', 'avatar'];
        const updates = {};

        Object.keys(updateData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = updateData[key];
            }
        });

        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async addLoyaltyPoints(userId, points) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.loyaltyPoints += points;
        await user.save();
        return user;
    }

    async getAllUsers() {
        return await User.find().sort({ createdAt: -1 });
    }
}

module.exports = new UserService();
