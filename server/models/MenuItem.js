const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        available: {
            type: Boolean,
            default: true,
        },
        dietary: [{
            type: String,
        }],
        prepTime: {
            type: Number,
            default: 15,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        popular: {
            type: Boolean,
            default: false,
        },
        spicy: {
            type: Boolean,
            default: false,
        },
        new: {
            type: Boolean,
            default: false,
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

module.exports = mongoose.model('MenuItem', menuItemSchema);
