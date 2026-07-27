const Order = require('../models/Order');
const User = require('../models/User');

class OrderService {
    async createOrder(orderData, user) {
        const order = await Order.create({
            ...orderData,
            customerId: user ? (user._id || user.id) : orderData.customerId,
            customerName: user ? user.name : orderData.customerName,
        });

        // Award loyalty points (10 points per dollar)
        if (user && user._id) {
            const pointsEarned = Math.floor(order.total * 10);
            await User.findByIdAndUpdate(user._id, {
                $inc: { loyaltyPoints: pointsEarned },
            });
        }

        return order;
    }

    async getOrdersByUser(userId) {
        return await Order.find({ customerId: userId }).sort({ createdAt: -1 });
    }

    async getAllOrders(filters = {}) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.type) {
            query.type = filters.type;
        }
        return await Order.find(query).sort({ createdAt: -1 });
    }

    async getOrderById(id) {
        const order = await Order.findById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async updateOrderStatus(id, status, paymentStatus) {
        const update = {};
        if (status) update.status = status;
        if (paymentStatus) update.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(id, update, { new: true });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
}

module.exports = new OrderService();
