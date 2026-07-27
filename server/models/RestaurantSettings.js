const mongoose = require('mongoose');

const restaurantSettingsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: 'Ember & Oak',
        },
        tagline: {
            type: String,
            default: 'Farm-to-table dining, elevated.',
        },
        phone: {
            type: String,
            default: '+1 (555) 234-5678',
        },
        email: {
            type: String,
            default: 'concierge@emberandoak.com',
        },
        address: {
            type: String,
            default: '742 Evergreen Terrace, San Francisco, CA',
        },
        pointsPerDollar: {
            type: Number,
            default: 10,
        },
        openingHours: {
            type: String,
            default: 'Mon-Sun: 5:00 PM - 11:00 PM',
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

module.exports = mongoose.model('RestaurantSettings', restaurantSettingsSchema);
