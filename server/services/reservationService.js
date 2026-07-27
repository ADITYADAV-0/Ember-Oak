const Reservation = require('../models/Reservation');

class ReservationService {
    async createReservation(data) {
        return await Reservation.create(data);
    }

    async getReservationsByEmail(email) {
        return await Reservation.find({ customerEmail: email.toLowerCase() }).sort({ date: 1, time: 1 });
    }

    async getAllReservations() {
        return await Reservation.find().sort({ date: 1, time: 1 });
    }

    async updateReservationStatus(id, status, tableId) {
        const update = { status };
        if (tableId) update.tableId = tableId;

        const reservation = await Reservation.findByIdAndUpdate(id, update, { new: true });
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return reservation;
    }

    async cancelReservation(id) {
        const reservation = await Reservation.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return reservation;
    }
}

module.exports = new ReservationService();
