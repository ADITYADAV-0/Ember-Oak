const mongoose = require('mongoose');

const loyaltyTransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['earn', 'redeem'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            default: () => new Date().toISOString(),
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

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
