const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const User = require('../models/User');

class AdminService {
    async getDashboardMetrics() {
        const todayStr = new Date().toISOString().split('T')[0];

        const [totalOrders, pendingOrders, totalReservations, totalTables, totalCustomers] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: 'pending' }),
            Reservation.countDocuments(),
            Table.countDocuments(),
            User.countDocuments({ role: 'customer' }),
        ]);

        const orders = await Order.find({ paymentStatus: 'paid' });
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        return {
            totalOrders,
            pendingOrders,
            totalReservations,
            totalTables,
            totalCustomers,
            totalRevenue,
            todayDate: todayStr,
        };
    }

    async getAllTables() {
        return await Table.find().sort({ number: 1 });
    }

    async updateTableStatus(id, status, reservation, orderId, seatedAt) {
        const update = { status };
        if (reservation !== undefined) update.reservation = reservation;
        if (orderId !== undefined) update.orderId = orderId;
        if (seatedAt !== undefined) update.seatedAt = seatedAt;

        const table = await Table.findByIdAndUpdate(id, update, { new: true });
        if (!table) {
            throw new Error('Table not found');
        }
        return table;
    }
}

module.exports = new AdminService();
