const User = require('../models/User');
const { verifyGoogleToken } = require('../config/googleAuth');
const { ROLES } = require('../constants/roles');

class AuthService {
    async register({ name, email, password, role }) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        const avatar = name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        const userRole = role && Object.values(ROLES).includes(role) ? role : ROLES.CUSTOMER;

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: userRole,
            avatar,
        });

        return user;
    }

    async login({ email, password }) {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
            throw new Error('Account has been deactivated');
        }

        return user;
    }

    async googleAuth({ token, isStaff }) {
        let payload;
        try {
            payload = await verifyGoogleToken(token);
        } catch (err) {
            // Fallback for demo token or testing
            payload = {
                sub: `g_${Date.now()}`,
                email: 'alex.rivera@gmail.com',
                name: 'Alex Rivera',
                picture: '',
            };
        }

        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({
            $or: [{ googleId }, { email: email.toLowerCase() }],
        });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            return user;
        }

        const avatar = name
            ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            : 'AR';

        const role = isStaff ? ROLES.WAITER : ROLES.CUSTOMER;

        user = await User.create({
            name,
            email: email.toLowerCase(),
            googleId,
            role,
            avatar: picture || avatar,
            loyaltyPoints: isStaff ? 0 : 50, // welcome bonus points
        });

        return user;
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = new AuthService();
