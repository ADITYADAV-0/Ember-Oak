const mongoose = require('mongoose');
const { ORDER_STATUS, PAYMENT_STATUS, ORDER_TYPE } = require('../constants/status');

const orderItemSchema = new mongoose.Schema(
    {
        menuItemId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            default: null,
        },
        customerId: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        items: [orderItemSchema],
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        createdAt: {
            type: String,
            default: () => new Date().toISOString(),
        },
        estimatedMinutes: {
            type: Number,
            default: 20,
        },
        type: {
            type: String,
            enum: Object.values(ORDER_TYPE),
            default: ORDER_TYPE.DINE_IN,
        },
        notes: {
            type: String,
            default: '',
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.UNPAID,
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

module.exports = mongoose.model('Order', orderSchema);
