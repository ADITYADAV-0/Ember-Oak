const mongoose = require('mongoose');
const { RESERVATION_STATUS } = require('../constants/status');

const reservationSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        customerEmail: {
            type: String,
            required: [true, 'Customer email is required'],
            trim: true,
            lowercase: true,
        },
        customerPhone: {
            type: String,
            required: [true, 'Customer phone is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Reservation date is required'],
        },
        time: {
            type: String,
            required: [true, 'Reservation time is required'],
        },
        partySize: {
            type: Number,
            required: [true, 'Party size is required'],
            min: 1,
        },
        tableId: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: Object.values(RESERVATION_STATUS),
            default: RESERVATION_STATUS.CONFIRMED,
        },
        specialRequests: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

module.exports = mongoose.model('Reservation', reservationSchema);
