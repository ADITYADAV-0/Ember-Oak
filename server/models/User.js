const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        googleId: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.CUSTOMER,
        },
        avatar: {
            type: String,
            default: '',
        },
        loyaltyPoints: {
            type: Number,
            default: 0,
        },
        joinDate: {
            type: String,
            default: () => new Date().toISOString().split('T')[0],
        },
        preferences: [{
            type: String,
        }],
        dietary: [{
            type: String,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
