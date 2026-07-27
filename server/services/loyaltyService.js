const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const User = require('../models/User');

class LoyaltyService {
    async getUserPoints(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const transactions = await LoyaltyTransaction.find({ userId }).sort({ createdAt: -1 });

        return {
            loyaltyPoints: user.loyaltyPoints,
            history: transactions,
        };
    }

    async addPoints(userId, points, description) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.loyaltyPoints += points;
        await user.save();

        const transaction = await LoyaltyTransaction.create({
            userId,
            points,
            type: 'earn',
            description,
        });

        return { user, transaction };
    }

    async redeemPoints(userId, points, description) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.loyaltyPoints < points) {
            throw new Error('Insufficient loyalty points');
        }

        user.loyaltyPoints -= points;
        await user.save();

        const transaction = await LoyaltyTransaction.create({
            userId,
            points,
            type: 'redeem',
            description,
        });

        return { user, transaction };
    }
}

module.exports = new LoyaltyService();
