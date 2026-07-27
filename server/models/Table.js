const mongoose = require('mongoose');
const { TABLE_STATUS, TABLE_ZONE } = require('../constants/status');

const tableReservationSchema = new mongoose.Schema(
    {
        name: { type: String },
        time: { type: String },
        party: { type: Number },
        phone: { type: String },
    },
    { _id: false }
);

const tableSchema = new mongoose.Schema(
    {
        number: {
            type: Number,
            required: true,
            unique: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(TABLE_STATUS),
            default: TABLE_STATUS.AVAILABLE,
        },
        zone: {
            type: String,
            enum: Object.values(TABLE_ZONE),
            default: TABLE_ZONE.INDOOR,
        },
        reservation: {
            type: tableReservationSchema,
            default: null,
        },
        orderId: {
            type: String,
            default: null,
        },
        seatedAt: {
            type: String,
            default: null,
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

module.exports = mongoose.model('Table', tableSchema);
